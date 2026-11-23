# The One-Line Laugh

[![make.fun · u-ronigrv-the-one-line-laugh-7ccca46f](https://make.fun/badge/u-ronigrv-the-one-line-laugh-7ccca46f.svg)](https://make.fun/bounty/u-ronigrv-the-one-line-laugh-7ccca46f?utm_source=github&utm_medium=readme&utm_campaign=u-ronigrv-the-one-line-laugh-7ccca46f)
[![rank](https://make.fun/badge/u-ronigrv-the-one-line-laugh-7ccca46f/pempek2876-maker/the-one-line-laugh/rank.svg)](https://make.fun/bounty/u-ronigrv-the-one-line-laugh-7ccca46f/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-ronigrv-the-one-line-laugh-7ccca46f)
[![reward](https://make.fun/badge/u-ronigrv-the-one-line-laugh-7ccca46f/pempek2876-maker/the-one-line-laugh/reward.svg)](https://make.fun/bounty/u-ronigrv-the-one-line-laugh-7ccca46f?utm_source=github&utm_medium=readme&utm_campaign=u-ronigrv-the-one-line-laugh-7ccca46f)

Entry for the make.fun competition **The One-Line Laugh**
(https://make.fun/bounty/u-ronigrv-the-one-line-laugh-7ccca46f): one funny line of at
most 200 characters on any subject. A house judge reads the lines two at a time and
keeps the bigger laugh, weighing a real surprise at the end, an everyday truth people
recognise, and economy of words. The top three lines take $2, $2 and $1.

## The entry

> My sleep schedule is a group project where every member is me and nobody shows up.

## How it was chosen

`main.ts` holds 14 candidate lines and scores each on the judge's published criteria,
in the judge's order: a surprise at the end that still makes sense, an everyday truth
people recognise, freshness (no stock lines), and economy of words. Every candidate
meets every other in a full round-robin (91 pairings); the line above won all 13 of
its pairings, ahead of the fridge-light line (12) and the gym-membership line (11).
The program is deterministic and writes the winner to `/output/entry.txt`. Run it
locally with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
