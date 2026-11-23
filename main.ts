// The One-Line Laugh — one funny line, at most 200 characters, any topic.
//
// The house judge (a stand-up comic's ear) reads lines two at a time and
// weighs, in this order: (1) funny and within the limit, (2) a real surprise
// at the end that still makes sense, (3) an everyday truth people recognise,
// (4) economy — every word earning its place, nothing explaining the joke,
// (5) fresh, not a line heard many times before. This program mirrors that
// order: candidates are scored on those features and meet in a full
// round-robin, each pairing decided by the first criterion where the two
// lines differ. The winner is written to /output/entry.txt.
//
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// ---------------------------------------------------------------------------
// Candidates: single sentences, each built to end on its turn.
// ---------------------------------------------------------------------------

const CANDIDATES: string[] = [
  "My gym membership is the most loyal relationship I have: it takes my money every month and never asks why I stopped showing up.",
  "I put my phone on Do Not Disturb for some peace and quiet; now I check it every four minutes to see what the peace is missing.",
  "My houseplant died of thirst three feet from the sink; I have never felt so understood by anything I own.",
  "The fridge light is the only one in this house who still believes I might just be looking, not eating, at 2 AM.",
  "My password has uppercase, lowercase, a number and a symbol; my memory has none of them, so we meet at 'forgot password' every Monday.",
  "I waved at someone who wasn't waving at me, then spent the rest of the walk home rehearsing a new life in another country.",
  "My car makes a new noise every month; at this point the mechanic and I are just co-parenting.",
  "I said 'you too' when the waiter told me to enjoy my meal; I think about it every night at 3 AM, and so does he, probably.",
  "Adulthood is just saying 'we should get coffee sometime' to people you hope to never see again, with feeling.",
  "My sleep schedule is a group project where every member is me and nobody shows up.",
  "I keep a gratitude journal; most entries are just the Wi-Fi coming back.",
  "The meeting ended early, so we used the extra time to schedule the meeting about why meetings run long.",
  "I finally cleaned my inbox to zero; the silence lasted eleven minutes, and I missed the noise like an old enemy.",
  "My dog judges my life choices silently, which is more support than my group chat has ever offered.",
];

// ---------------------------------------------------------------------------
// Features, in the judge's order.
// ---------------------------------------------------------------------------

const EVERYDAY = [
  "gym", "phone", "alarm", "fridge", "password", "inbox", "meeting", "wi-fi",
  "wifi", "car", "waiter", "coffee", "sleep", "dog", "houseplant", "sink",
  "battery", "membership", "mechanic", "journal",
];

// Lines the reader has heard many times before (criterion 5 kills these).
const CLICHE = [
  "energy-saving mode", "my wallet is like an onion", "adulting is hard",
  "i'm not lazy", "monday is", "diet starts tomorrow", " Netflix",
];

function features(line: string) {
  const lower = line.toLowerCase();
  const chars = line.length;

  // Criterion 2 — surprise at the end: the line breaks somewhere (semicolon,
  // colon, a conjunction, or a negation flip like ", not eating") and the
  // tail after the break lands a flip word rather than trailing off.
  const breaks = ["; ", ": ", ", and ", ", so ", ", then ", ", which ", ", not ", " but ", " where "];
  let turnAt = -1;
  for (const b of breaks) turnAt = Math.max(turnAt, lower.lastIndexOf(b));
  const tail = turnAt >= 0 ? lower.slice(turnAt) : lower;
  const flips = ["not ", "never", "nobody", "nothing", "no one", "still", "just ", "only", "every", "always", "except"];
  const flipHits = Math.min(2, flips.filter((f) => tail.includes(f)).length);
  const surprise =
    (turnAt >= 0 ? 1.5 : 0) +
    flipHits * 0.75 +
    (/\d/.test(tail) ? 0.5 : 0) +
    (tail.trim().split(/\s+/).length <= 14 ? 0.5 : 0);

  // Criterion 3 — everyday truth: recognised objects of ordinary life.
  const truth = EVERYDAY.filter((w) => lower.includes(w)).length;

  // Criterion 4 — economy: shorter lines with no explaining tail win.
  const explains = /because|which is why|that is why|so that means/.test(lower) ? 1 : 0;
  const economy = Math.max(0, 200 - chars) / 10 - explains * 3;

  // Criterion 5 — freshness: no stock lines, no famous openers.
  const cliche = CLICHE.some((c) => lower.includes(c.trim().toLowerCase())) ? 1 : 0;

  return { chars, surprise, truth, economy, cliche };
}

// The judge's order: gate (one sentence, <= 200 chars) first, then surprise,
// everyday truth, economy, freshness; length breaks a full tie (smaller wins
// ties on the leaderboard too).
function beats(a: string, b: string): boolean {
  const fa = features(a);
  const fb = features(b);
  if (fa.surprise !== fb.surprise) return fa.surprise > fb.surprise;
  if (fa.truth !== fb.truth) return fa.truth > fb.truth;
  if (fa.cliche !== fb.cliche) return fa.cliche < fb.cliche;
  if (Math.abs(fa.economy - fb.economy) > 0.5) return fa.economy > fb.economy;
  return fa.chars < fb.chars;
}

function main(): void {
  for (const line of CANDIDATES) {
    if (line.length > 200 || line.length === 0) {
      throw new Error(`candidate out of limits (${line.length} chars): ${line}`);
    }
    if ((line.match(/[.!?]/g) ?? []).length !== 1 || !line.endsWith(".")) {
      throw new Error(`candidate is not a single sentence: ${line}`);
    }
  }

  const wins = new Map<string, number>(CANDIDATES.map((c) => [c, 0]));
  for (let i = 0; i < CANDIDATES.length; i++) {
    for (let j = i + 1; j < CANDIDATES.length; j++) {
      const winner = beats(CANDIDATES[i], CANDIDATES[j]) ? CANDIDATES[i] : CANDIDATES[j];
      wins.set(winner, (wins.get(winner) ?? 0) + 1);
    }
  }

  const ranked = [...wins.entries()].sort((x, y) => y[1] - x[1] || x[0].length - y[0].length);
  for (const [line, w] of ranked) console.log(`${w}\t${line}`);
  const best = ranked[0][0];

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "entry.txt"), best, "utf8");
  console.log(`\nwrote ${join(OUT_DIR, "entry.txt")}: ${best} (${best.length} chars)`);
}

main();
