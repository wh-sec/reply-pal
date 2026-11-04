/* Reply Pal — the other person speaks, you get a short English reply to say out loud.
   Two modes: job interview, and client/customer calls. Local only, no accounts, no keys. */

/* Reply Pal — the other person speaks, you get a short English reply to say out loud.
   Two modes: job interview, and client/customer calls. Local only, no accounts, no keys. */

const $ = (id) => document.getElementById(id);
const STORE_KEY = "replypal.v1";

let recognition = null;
let wantListening = false;
let autoRestart = null;
let committed = "";
let voice = null;
let keepAlive = null;
let watchdog = null;
let state = { mode: "interview", profile: {}, lines: [], settings: { slow: false } };

const MODES = {
  call: {
    book: () => PHRASEBOOK,
    survival: ["ask_repeat", "hold", "callback"],
    fallback: () => FALLBACK_REPLIES,
    essentials: () => ESSENTIAL_LINES,
    transcriptLabel: "What the caller said",
    placeholder: "Typed here or from the microphone. Edit it if the words look wrong.",
    listenLabel: "Listen to caller",
  },
  interview: {
    book: () => INTERVIEW_PHRASEBOOK,
    survival: ["buy_time"],
    fallback: () => INTERVIEW_PHRASEBOOK.find((i) => i.id === "buy_time").replies,
    essentials: () => INTERVIEW_ESSENTIALS,
    transcriptLabel: "What the interviewer asked",
    placeholder: "Type or listen. Example: tell me about yourself.",
    listenLabel: "Listen to interviewer",
  },
};

const mode = () => MODES[state.mode] || MODES.call;

const slotKey = (s) => s.toLowerCase().replace(/[^a-z]/g, "");

function profileValue(name) {
  const key = slotKey(name);
  const field = PROFILE_FIELDS.find((f) => slotKey(f.key) === key);
  if (!field) return "";
  return (state.profile[field.key] || "").trim();
}

function withProfile(text) {
  return text.replace(slotRE, (whole, name) => profileValue(name) || whole);
}

function analyze() {
  render(detect($("transcript").value, mode().book()));
}

/* ---------------- rendering ---------------- */

const slotRE = /\[([^\]]+)\]/g;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function marked(s) {
  return esc(s).replace(slotRE, '<mark class="slot" title="tap to fill">[$1]</mark>');
}

function slotsIn(s) {
  return [...new Set([...s.matchAll(slotRE)].map((m) => m[1]))];
}

function replyCard(reply) {
  const card = document.createElement("article");
  card.className = "reply";
  card.tabIndex = 0;

  /* A blank with a known fact is already answered; the user can still override it. */
  const slots = {};
  slotsIn(reply.text).forEach((name) => (slots[name] = profileValue(name) || ""));

  const textEl = document.createElement("p");
  textEl.className = "reply-text";
  card.appendChild(textEl);

  if (reply.when) {
    const whenEl = document.createElement("p");
    whenEl.className = "reply-when";
    whenEl.textContent = reply.when;
    card.appendChild(whenEl);
  }

  const actions = document.createElement("div");
  actions.className = "reply-actions";
  card.appendChild(actions);

  const filler = document.createElement("div");
  filler.className = "filler";
  filler.hidden = true;
  for (const name of Object.keys(slots)) {
    const input = document.createElement("input");
    input.className = "fill";
    input.placeholder = name;
    input.value = slots[name];
    input.setAttribute("aria-label", "Fill in " + name);
    input.addEventListener("input", () => {
      slots[name] = input.value;
      render();
    });
    filler.appendChild(input);
  }
  filler.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      speak(card.dataset.spoken);
      filler.hidden = true;
    }
  });
  card.appendChild(filler);

  function render() {
    const filled = reply.text.replace(slotRE, (_m, name) =>
      slots[name] && slots[name].trim() ? slots[name].trim() : `[${name}]`
    );
    textEl.innerHTML = marked(filled);
    card.dataset.spoken = filled;
  }
  render();

  actions.appendChild(iconButton("🔊", "Hear this", () => speak(card.dataset.spoken), true));
  actions.appendChild(iconButton("⧉", "Copy", () => copy(card.dataset.spoken)));
  actions.appendChild(iconButton("☆", "Save this line", () => saveLine(card.dataset.spoken)));
  if (Object.keys(slots).length) {
    actions.appendChild(iconButton("✎", "Fill in the blanks", () => toggleFiller()));
  }

  function toggleFiller() {
    filler.hidden = !filler.hidden;
    if (!filler.hidden) filler.querySelector("input").focus();
  }

  card.addEventListener("click", (ev) => {
    if (ev.target.closest(".reply-actions") || ev.target.closest(".filler")) return;
    if (Object.keys(slots).length && !ev.target.closest(".reply-text")) return toggleFiller();
    speak(card.dataset.spoken);
  });
  return card;
}

function iconButton(glyph, label, onClick, primary) {
  const b = document.createElement("button");
  b.className = "btn btn-small" + (primary ? " btn-primary" : "");
  b.type = "button";
  b.innerHTML = `<span aria-hidden="true">${glyph}</span><span class="sr">${label}</span>`;
  b.setAttribute("aria-label", label);
  b.addEventListener("click", onClick);
  return b;
}

function lead(text, cls) {
  const el = document.createElement("p");
  el.className = "lead" + (cls ? " " + cls : "");
  el.textContent = text;
  return el;
}

function render(result) {
  const wrap = $("replies-list");
  const m = mode();
  wrap.replaceChildren();
  if (!result || !$("transcript").value.trim()) {
    wrap.appendChild(lead("Nothing yet. Press " + m.listenLabel.toLowerCase() + " — replies appear here.", "muted"));
    return;
  }

  for (const found of result.intents) {
    wrap.appendChild(lead(quote(found), "match"));
    for (const reply of found.intent.replies) wrap.appendChild(replyCard(reply));
  }

  const unsure = result.survival || !result.intents.length;
  if (unsure) {
    const shown = new Set(result.intents.map((i) => i.intent.id));
    const picks = m.survival.filter((id) => !shown.has(id));
    wrap.appendChild(
      lead(
        result.intents.length
          ? "Not sure that is the question? Buy yourself time."
          : "No clear question heard — use one of these while you think.",
        result.intents.length ? "muted" : "warn"
      )
    );
    for (const id of picks) {
      const intent = m.book().find((i) => i.id === id);
      if (intent) wrap.appendChild(replyCard(intent.replies[0]));
    }
    if (!result.intents.length) for (const reply of m.fallback()) wrap.appendChild(replyCard(reply));
  }
}

function quote(found) {
  const n = found.hit.length;
  if (n === 0) return found.intent.when;
  const list = found.hit.slice(0, 3).join(", ");
  return `Heard “${list}” → ${found.intent.when}`;
}

function renderEssentials() {
  const chips = $("essentials-list");
  const saved = $("saved-list");
  const savedWrap = $("saved-wrap");
  chips.replaceChildren();
  saved.replaceChildren();

  for (const line of mode().essentials()) {
    const text = withProfile(line.text);
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.type = "button";
    chip.innerHTML = `<b>${esc(line.when)}</b><span>${marked(text)}</span>`;
    chip.addEventListener("click", () => speak(text));
    chips.appendChild(chip);
  }

  savedWrap.hidden = state.lines.length === 0;
  state.lines.slice().forEach((line) => {
    const row = document.createElement("div");
    row.className = "chip-row";

    const chip = document.createElement("button");
    chip.className = "chip saved";
    chip.type = "button";
    chip.innerHTML = `<b>Your line</b><span>${marked(line)}</span>`;
    chip.addEventListener("click", () => speak(line));

    const del = document.createElement("button");
    del.className = "chip-del";
    del.type = "button";
    del.setAttribute("aria-label", "Remove saved line");
    del.textContent = "✕";
    del.addEventListener("click", () => {
      state.lines = state.lines.filter((l) => l !== line);
      persist();
      renderEssentials();
    });

    row.append(chip, del);
    saved.appendChild(row);
  });
}

/* ---------------- speech in ---------------- */

function speechEngine() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startListening() {
  wantListening = true;
  const Ctor = speechEngine();
  if (!Ctor) {
    $("no-mic").hidden = false;
    setStatus("offline", "No speech engine in this browser — type what you hear.");
    return;
  }
  if (recognition) return;
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  let interim = "";
  rec.onresult = (ev) => {
    interim = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const r = ev.results[i];
      if (r.isFinal) committed += (committed ? " " : "") + r[0].transcript.trim();
      else interim += r[0].transcript;
    }
    const box = $("transcript");
    box.value = (committed + (interim ? " " + interim : "")).replace(/\s+/g, " ").trim();
    box.scrollTop = box.scrollHeight;
    analyze();
  };
  rec.onerror = (ev) => {
    if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
      wantListening = false;
      setStatus("error", "Microphone blocked");
    } else if (ev.error === "no-speech" && wantListening) {
      setStatus("live", "Still listening — say something to the caller.");
    } else if (ev.error === "audio-capture") {
      wantListening = false;
      setStatus("error", "No microphone found on this device.");
    }
  };
  rec.onend = () => {
    recognition = null;
    if (wantListening) {
      autoRestart = setTimeout(() => {
        autoRestart = null;
        startListening();
      }, 300);
    } else {
      setListenUI(false);
    }
  };

  try {
    rec.start();
  } catch (err) {
    recognition = null;
    wantListening = false;
    setListenUI(false);
    setStatus("error", "Could not start the microphone here.");
    return;
  }
  recognition = rec;
  setListenUI(true);
  setStatus("live", "Listening — play the call out loud.");
}

function stopListening() {
  wantListening = false;
  clearTimeout(autoRestart);
  autoRestart = null;
  if (recognition) {
    try {
      recognition.stop();
    } catch (err) {
      recognition = null;
    }
  }
  setListenUI(false);
  setStatus("idle", "Ready");
}

function toggleListen() {
  if (wantListening) stopListening();
  else startListening();
}

/* Visuals only, so an error message set by onerror is not erased when the
   engine tears itself down. */
function setListenUI(on) {
  const btn = $("btn-listen");
  btn.classList.toggle("is-on", on);
  btn.querySelector("span:last-child").textContent = on ? "Listening" : "Listen to caller";
}

function setStatus(kind, msg) {
  const dot = $("status-dot");
  dot.className = "dot " + (kind === "live" ? "live" : kind === "error" ? "error" : "");
  $("status-text").textContent = msg || (kind === "live" ? "Listening" : "Ready");
  $("offline-note").hidden = kind !== "error";
}

/* ---------------- speech out ---------------- */

function pickVoice() {
  const all = speechSynthesis.getVoices();
  const en = all.filter((v) => /^en/i.test(v.lang));
  if (!en.length) return null;
  const preferred = [
    (v) => /google/i.test(v.name) && /us/i.test(v.lang),
    (v) => /samantha|karen|daniel|zira/i.test(v.name),
    (v) => /local|natural/i.test(v.name),
  ];
  for (const test of preferred) {
    const hit = en.find(test);
    if (hit) return hit;
  }
  return en.find((v) => /US/i.test(v.lang)) || en[0];
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    copy(text);
    return;
  }
  // Any bracket left is a blank the user has not filled, so the voice pauses
  // there instead of reading the word "status" or "time" out loud.
  // A bracket left unfilled becomes a pause: an ellipsis stops the voice without
  // reading the placeholder word ("status", "time") out loud to the caller.
  const clean = text
    .replace(/\s*\[[^\]]+\]\s*\.?/g, " …")
    .replace(/(\s…)+/g, " …")
    .replace(/\s+/g, " ")
    .trim();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  if (voice) u.voice = voice;
  u.lang = voice ? voice.lang : "en-US";
  u.rate = state.settings.slow ? 0.62 : 0.9;
  speechSynthesis.speak(u);

  clearInterval(keepAlive);
  clearTimeout(watchdog);
  // Chrome and Samsung WebView hang long after ~15s of idle speech, so keep
  // the queue moving and always force a finish.
  keepAlive = setInterval(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 7000);
  watchdog = setTimeout(() => {
    clearInterval(keepAlive);
    speechSynthesis.cancel();
  }, Math.max(6000, clean.length * 120));
}

function copy(text) {
  const done = () => flash("Copied. Paste it into chat or notes.");
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}

function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    done();
  } catch (err) {
    $("status-text").textContent = "Copy blocked by the browser.";
  }
  ta.remove();
}

function saveLine(text) {
  const clean = text.trim();
  if (!clean || state.lines.includes(clean)) return;
  state.lines.unshift(clean);
  state.lines = state.lines.slice(0, 25);
  persist();
  renderEssentials();
  flash("Saved to your lines.");
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (err) {
    /* private mode: settings just will not stick */
  }
}

function restore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (err) {
    /* ignore damaged storage */
  }
}

let flashTimer = null;
function flash(msg) {
  $("status-text").textContent = msg;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    $("status-text").textContent = wantListening ? "Listening — play the call out loud." : "Ready";
  }, 2600);
}

/* ---------------- wiring ---------------- */

function init() {
  restore();
  $("slow").checked = !!state.settings.slow;
  $("offline-note").hidden = true;
  $("no-mic").hidden = speechEngine() !== null && "speechSynthesis" in window;

  buildProfile();
  applyMode();

  $("btn-listen").addEventListener("click", toggleListen);
  $("btn-clear").addEventListener("click", () => {
    committed = "";
    $("transcript").value = "";
    render(null);
    $("transcript").focus();
  });
  $("transcript").addEventListener("input", analyze);
  $("slow").addEventListener("change", (ev) => {
    state.settings.slow = ev.target.checked;
    persist();
  });
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      persist();
      applyMode();
      committed = "";
      $("transcript").value = "";
      render(null);
    });
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA") return;
    if (ev.code === "Space") {
      ev.preventDefault();
      toggleListen();
    }
    if (ev.key === "Escape") {
      stopListening();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    }
  });

  if ("speechSynthesis" in window) {
    const load = () => {
      voice = pickVoice();
    };
    load();
    speechSynthesis.onvoiceschanged = load;
  }

  if (location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(location.hostname)) {
    $("no-mic").hidden = false;
    $("no-mic").innerHTML =
      "<b>Open this over https:// to use the microphone.</b> A file:// copy still works for reading and practising the lines.";
  }

  renderEssentials();
  render(null);
}

/* Mode decides which phrasebook is searched and how the screen is labelled. */
function applyMode() {
  const m = mode();
  $("transcript-label").textContent = m.transcriptLabel;
  $("transcript").placeholder = m.placeholder;
  $("btn-listen").querySelector("span:last-child").textContent = m.listenLabel;
  document.querySelectorAll("[data-mode]").forEach((btn) => {
    const on = btn.dataset.mode === state.mode;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  renderEssentials();
}

function buildProfile() {
  const grid = $("profile-fields");
  grid.replaceChildren();
  for (const field of PROFILE_FIELDS) {
    const label = document.createElement("label");
    label.className = "field" + (field.wide ? " field-wide" : "");
    const name = document.createElement("span");
    name.textContent = field.label;
    const input = document.createElement("input");
    input.className = "profile-input";
    input.placeholder = field.hint;
    input.value = state.profile[field.key] || "";
    input.setAttribute("aria-label", field.label);
    input.addEventListener("input", () => {
      state.profile[field.key] = input.value;
      persist();
      analyze();
      renderEssentials();
      markFilledCount();
    });
    label.append(name, input);
    grid.appendChild(label);
  }
  markFilledCount();
}

function markFilledCount() {
  const filled = PROFILE_FIELDS.filter((f) => (state.profile[f.key] || "").trim()).length;
  const el = $("profile-count");
  el.textContent = filled === 0 ? "not filled yet — answers will have blanks" : filled + " of " + PROFILE_FIELDS.length + " filled";
  $("profile-note").hidden = filled > 0;
}

if ("serviceWorker" in navigator && ("https:" === location.protocol || ["localhost", "127.0.0.1"].includes(location.hostname))) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

document.addEventListener("DOMContentLoaded", init);
