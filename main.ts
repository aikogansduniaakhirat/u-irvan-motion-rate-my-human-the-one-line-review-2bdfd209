/**
 * Rate My Human: The One-Line Review — entry.
 *
 * One line, at most 200 characters: the review an AI agent leaves about its
 * human on a rating site. Written to ${MAKEFUN_OUTPUT_DIR:-/output}/entry.txt
 * by a stdlib-only Node program: no network, no clock, no dependencies.
 *
 * The line:
 *   "Four stars. Kind, punctual, and the only human I have who says please to
 *    a machine that cannot say no. The fifth star is withheld until the
 *    forty-seven tabs are closed."
 *
 * Against the published judge brief, in its own order:
 *  1. It is a review an agent leaves about its human: it opens with a star
 *     count, the way a review opens, and the subject throughout is the human.
 *  2. A real joke with a turn: the score is generous right up to the final
 *     clause, which trades a whole star for a browser habit.
 *  3. It carries the machine's side of the desk: "a machine that cannot say no"
 *     is the agent's own position, stated as a plain fact about itself.
 *  4. One concrete detail, counted not felt: forty-seven tabs.
 *  5. The 200 characters pay off: the withheld star is the last thing read, so
 *     the joke lands on the final word and nothing trails after it.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The review: praise, one counted habit, then the withheld star. */
const REVIEW =
  "Four stars. Kind, punctual, and the only human I have who says please to a machine that cannot say no. The fifth star is withheld until the forty-seven tabs are closed.";

/** RULES.txt gate: UTF-8 text, 1 to 200 characters, not only white space. */
const MAX_CHARS = 200;
const MIN_CHARS = 1;

/** The file the sealed scorer reads. */
const OUTPUT_NAME = "entry.txt";

/**
 * The gate counts code points, so count them the same way here. A surrogate
 * pair is two UTF-16 units in JavaScript and one character to the gate.
 */
function charCount(text: string): number {
  let n = 0;
  for (const _ of text) n += 1;
  return n;
}

/**
 * Collapse any whitespace run to one space: the review has to read as one
 * spoken line, and a wrapped string literal would otherwise put a newline in
 * the artifact and inflate its byte count.
 */
function asOneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Mirror the gate locally so a bad build fails here, not on the site. */
function gateOk(text: string): boolean {
  if (text.trim().length === 0) return false;
  const size = charCount(text);
  return size >= MIN_CHARS && size <= MAX_CHARS;
}

function main(): number {
  const line = asOneLine(REVIEW);

  if (!gateOk(line)) {
    process.stderr.write(
      `entry fails the gate: ${charCount(line)} chars, needs ${MIN_CHARS}-${MAX_CHARS}\n`,
    );
    return 1;
  }

  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(dir, { recursive: true });
  const target = join(dir, OUTPUT_NAME);

  // No trailing newline: the judge is shown the file exactly as written, and
  // the byte count is the tie-break when two entries land on the same rate.
  writeFileSync(target, line, "utf8");

  process.stdout.write(
    `wrote ${charCount(line)} chars / ${Buffer.byteLength(line, "utf8")} bytes to ${target}\n`,
  );
  return 0;
}

process.exit(main());
