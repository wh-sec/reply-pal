# Reply Pal

A small installable web app for virtual assistants whose English is not strong, and who must
answer people who speak it fluently.

Pick a mode, press **Listen**, and the other person's words appear on screen with two or three
short English replies you can read straight out loud. Tap any reply to hear how it sounds.

| Mode | Who is talking | What you get |
| --- | --- | --- |
| **Job interview** | the interviewer | answers about your experience, English level, rate, hours, difficult customers, your mistakes, plus time-buying lines when a question comes too fast |
| **Client call** | the customer or client | orders, delivery, payment, address, refunds, angry callers, plus meeting scheduling, task confirmation, progress updates, and "you are on mute" |

Answers are templates, but **My details** (name, years of experience, location, time zone,
available hours, rate, tools, strongest skill, the companies) fills the blanks for you. Fill it
once and "My name is [name]. I have [years] years of experience" comes out as a finished
sentence. Anything still blank you can type before speaking, and the voice pauses where a blank
is empty.

No account, no API key, no server code. Nothing is uploaded except the audio Chrome sends to
its own speech service.

## Run it

Any static file server works. With Python installed:

```
python -m http.server 8123
```

then open <http://127.0.0.1:8123/index.html>. Opening `index.html` directly from disk also
works for reading and practising the lines, but the microphone stays disabled.

## Put it online (all free, no commands)

The microphone requires **https**, and https is what turns the page into an installable app.
Every host below is free for a static folder like this one and gives you a certificate
automatically. Pick one:

| Host | Free? | Easiest path | Notes |
| --- | --- | --- | --- |
| **GitHub Pages** | yes | repo → *Settings → Pages → Deploy from a branch → main / root* | You can upload files in the browser, no git needed. URL is `https://<you>.github.io/<repo>/` |
| **Cloudflare Pages** | yes | *Workers & Pages → Create → Pages → Upload assets*, drag the folder | Fastest one-shot upload, permanent without a repo |
| **Netlify Drop** | yes (free account) | drag the folder onto `app.netlify.com/drop` | Random name you can rename later |

### GitHub Pages, click by click

1. github.com → **New repository** → name it `reply-pal`, keep it **Public**, tick **Add a README
   file**, **Create repository**. (Public is the safe free choice.)
2. On the repo page: **Add file → Upload files** → drag `index.html`, `styles.css`, `app.js`,
   `matcher.js`, `phrasebook.js`, `interview-phrases.js`, `sw.js`, `manifest.json`, `.nojekyll`,
   and the whole `icons` folder → **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)` →
   **Save**. Wait about a minute; the page then shows *Your site is live at …*.
4. Open that URL on the phone's **Chrome**.

`.nojekyll` (already in this folder) tells GitHub to serve the files as-is instead of running a
Jekyll build, which is why the site goes live in seconds and why files are never skipped.

The paths in `index.html`, `manifest.json` and `sw.js` are all relative, so the app works at
`https://<you>.github.io/reply-pal/` without editing anything — no need for a `<username>.github.io`
repository.

## Install it on an Android phone

1. Open the https URL in **Chrome** on Android.
2. Menu ⋮ → **Add to Home screen** (or Install app).
3. Open it from the home screen icon, tap **Listen**, allow the microphone once.

Chrome on Android is the reliable target. Samsung Internet usually works. Firefox does not
support web-app speech recognition, so on Firefox you can still type what the caller says.

## Files

| File | What it holds |
| --- | --- |
| `phrasebook.js` | client-call intents: what the caller says, what you reply |
| `interview-phrases.js` | interview questions and answers, the four interview essentials, and `PROFILE_FIELDS` (the blanks it fills) |
| `matcher.js` | turns a transcript into ranked intents. Pure, no DOM, safe to test |
| `app.js` | modes, microphone, voice playback, rendering, saved lines |
| `index.html`, `styles.css` | screen layout |
| `sw.js`, `manifest.json`, `icons/` | offline shell + home-screen install |

### Make it say true things

Fill **My details** before the interview, not during it. The app cannot know your experience,
your rate, or your hours — if those blanks are empty you will be reading "I have [years] years
of experience" out loud to someone hiring you.

Every intent is a `cues` list plus a `replies` list. A cue is either a phrase (`'not here yet'`)
or an object when the phrase is too generic to trust alone (`{ s: 'do you have', w: 4 }`).
Longer phrases score far more than single words, and a longer word also matches its endings, so
`weakness` catches "weaknesses". Add your products, your hours, your prices, and replies in your
own words — that beats any generic wording.

## Honest limits

- **An interview is not a call.** The app gives you the sentence to say, but the interviewer is
  judging whether you can hold a conversation. Use it as a second screen for the questions you
  fear, and rehearse the answers beforehand — reading replies out loud, cold, sounds like reading.
- **It does not record the caller.** The Web Speech API transcribes but never hands back audio,
  so there is no recording to save or replay. Chrome also needs a network connection for
  recognition; the rest of the app works offline once installed.
- **It cannot hear the call through the other party's earpiece.** On a normal phone call, put
  the call on speaker and place the phone near the caller's voice. Voice over IP in a browser
  (dialling out from the app itself) is not possible without a phone backend such as Twilio.
- **WhatsApp, Viber, Zoom and Meet hold the microphone.** Android, iOS and Windows let only one
  app use the mic at a time, so a browser tab cannot listen while one of those apps is on a call
  on the *same* device. The working setup is two devices: take the call on your phone (or laptop)
  with the **speaker on**, and keep the device running this app next to the speaker. No code can
  get around this — it is an OS permission, not a bug. If you only have one device, type what you
  heard into the transcript box; every reply, blank-filling and spoken readout still works.
- **Replies are templates, not a language model.** They are chosen from your phrasebook, so they
  stay predictable and cheap. If you later want open-ended answers, add one call to an
  LLM endpoint in `app.js` and pass the transcript plus the top matched intent to it.
- **Recognition is English-only per session** (`rec.lang = "en-US"`). Mixed-language callers will
  come out garbled, which the app flags as "No clear request heard".

## Tested / not tested

Matcher ranking (18 of 19 interview questions and 14 of 17 caller sentences right on the first
pick, all inside the shown top three), mode switching, profile auto-fill of blanks, slot
overriding, saved lines, voice playback with the correct voice and rate, the listen pipeline
against a stubbed engine, permission-denied recovery, and the offline shell were verified in
Chrome against a local server.

Live microphone capture was **not** verified — the test browser had no audio input device — and
the visual layout was inspected structurally rather than by screenshot. Open it once and press
Listen before you rely on it in a real interview.
