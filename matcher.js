/* matcher.js — pure transcript → intent matching. No DOM, so it is testable outside a browser. */

const CONTRACTIONS = [
  [/\bn't\b/g, " not"],
  [/\b(['’]s)\b/g, ""],
  [/\b(['’]re)\b/g, " are"],
  [/\b(['’]ll)\b/g, " will"],
  [/\b(['’]ve)\b/g, " have"],
  [/\b(['’]m)\b/g, " am"],
  [/\b(['’]d)\b/g, " would"],
  [/[’']/g, ""],
];

function norm(s) {
  let t = String(s).toLowerCase();
  for (const [re, to] of CONTRACTIONS) t = t.replace(re, to);
  return t
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\ba\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* A cue is either a phrase ("where is my order") or { s, w } when the phrase is
   generic and should not be trusted on its own ("do you have"). */
const WEIGHTS = [0, 3, 5, 8, 11, 13];

function cueText(cue) {
  return typeof cue === "string" ? cue : cue.re ? null : cue.s;
}

function cueWords(cue) {
  return norm(cueText(cue) || "x x").split(" ").filter(Boolean).length;
}

function cueWeight(cue) {
  if (typeof cue === "object" && cue.w) return cue.w;
  return WEIGHTS[Math.min(cueWords(cue), 5)];
}

function cueLabel(cue) {
  return cueText(cue) || String(cue.src || "phrased like that");
}

const RE_CACHE = new Map();

/* Word boundaries matter: the cue "deliver to" must not match "deliver tomorrow".
   Longer words also accept endings, so "weakness" matches "weaknesses" and
   "pay" matches "payment", while short words ("to") stay exact. */
function cueRE(cue) {
  if (cue.re) return cue.re;
  if (typeof cue === "object" && cue._re) return cue._re;
  const n = norm(cueText(cue));
  if (!n) return null;
  const cached = RE_CACHE.get(n);
  if (cached) return cached;

  const words = n.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const body = words.map((w, i) => {
    const last = i === words.length - 1;
    if (!last) return w + " ";
    return words.length === 1 || w.length >= 4 ? w + "\\w*" : w;
  }).join("");
  const tail = words.length === 1 ? "" : "(?: |$)";
  const re = new RegExp(`(?:^| )${body}${tail}`);

  RE_CACHE.set(n, re);
  if (typeof cue === "object") cue._re = re;
  return re;
}

function cueMatches(text, cue) {
  const re = cueRE(cue);
  return !!re && re.test(text);
}

function cueScoreIntent(text, intent, gibberish) {
  let score = 0;
  const hits = [];
  for (const cue of intent.cues) {
    if (!cueMatches(text, cue)) continue;
    const w = gibberish ? 1 : cueWeight(cue);
    score += w;
    hits.push({ cue: cueLabel(cue), w });
  }
  hits.sort((a, b) => b.w - a.w);
  const shown = [];
  for (const h of hits) {
    if (shown.length >= 2 || h.w < 3) break;
    if (!shown.includes(h.cue)) shown.push(h.cue);
  }
  return { score, hit: shown };
}

function detect(transcript, book) {
  const text = norm(transcript);
  const intents = book || PHRASEBOOK;
  if (!text) return { intents: [], survival: false, garbled: false };
  const words = text.split(" ").filter(Boolean);
  const hasVowel = /[aeiouy]/;
  const gibberish = words.filter((w) => w.length > 4 && !hasVowel.test(w)).length >= 2;

  const scored = intents
    .map((intent) => ({ intent, ...cueScoreIntent(text, intent, gibberish) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const unique = scored.filter((s, i) => scored.findIndex((o) => o.intent.id === s.intent.id) === i).slice(0, 3);
  const strongest = unique.length ? unique[0].score : 0;

  return {
    intents: unique,
    survival: gibberish || words.length < 3 || strongest < 3,
    garbled: gibberish || (words.length >= 3 && unique.length === 0),
  };
}
