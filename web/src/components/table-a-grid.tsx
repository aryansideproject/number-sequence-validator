"use client";

import type { Match } from "@/lib/types";

const GRID_COLS = 33;

const MATCH_COLOURS = [
  { bg: "bg-blue-500", text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
  { bg: "bg-orange-500", text: "text-white" },
  { bg: "bg-purple-500", text: "text-white" },
  { bg: "bg-rose-500", text: "text-white" },
  { bg: "bg-cyan-500", text: "text-white" },
  { bg: "bg-amber-500", text: "text-white" },
  { bg: "bg-indigo-500", text: "text-white" },
];

interface Props {
  digits: string;
  matches?: Match[];
}

export default function TableAGrid({ digits, matches }: Props) {
  const digitArray = Array.from(digits);

  const visibleMatches: { match: Match; colourIdx: number }[] = [];
  if (matches && matches.length > 0) {
    const k = matches[0].inputSequence.length;
    let colourIdx = 0;
    let lastEnd = -1;

    for (const m of matches) {
      if (m.position >= lastEnd) {
        visibleMatches.push({ match: m, colourIdx });
        lastEnd = m.position + k;
        colourIdx = (colourIdx + 1) % MATCH_COLOURS.length;
      }
    }
  }

  const positionToColour = new Map<number, number>();
  const matchStarts = new Set<number>();

  for (const { match, colourIdx } of visibleMatches) {
    const k = match.inputSequence.length;
    matchStarts.add(match.position);
    for (let j = 0; j < k; j++) {
      positionToColour.set(match.position + j, colourIdx);
    }
  }

  const hasHighlights = visibleMatches.length > 0;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Table A
        </h2>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {digits.length.toLocaleString()} digits — continuous stream
          {hasHighlights && (
            <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
              {matches!.length} total {matches!.length === 1 ? "match" : "matches"}
              {visibleMatches.length < matches!.length && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {" "}({visibleMatches.length} shown, {matches!.length - visibleMatches.length} overlapping)
                </span>
              )}
            </span>
          )}
        </span>
      </div>

      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50 overflow-x-auto">
        <div
          className="grid gap-0 w-fit mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1.25rem)`,
          }}
        >
          {digitArray.map((digit, pos) => {
            const colourIdx = positionToColour.get(pos);
            const isHighlighted = colourIdx !== undefined;
            const isMatchStart = matchStarts.has(pos);
            const colour = isHighlighted
              ? MATCH_COLOURS[colourIdx]
              : null;

            return (
              <div
                key={pos}
                className={`w-5 h-5 flex items-center justify-center text-xs font-mono tabular-nums select-none transition-colors ${
                  isHighlighted
                    ? `${colour!.bg} ${colour!.text} font-bold ${
                        isMatchStart ? "rounded-l-sm" : ""
                      }`
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
                title={
                  isHighlighted
                    ? `Match — pos ${pos}`
                    : `Position ${pos}`
                }
              >
                {digit}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
