"use client";

import { useEffect, useRef, useState } from "react";
import type { Match } from "@/lib/types";

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

// Cell size in px — smaller on mobile
const CELL_DESKTOP = 20;
const CELL_MOBILE = 14;
const GAP = 0;

interface Props {
  digits: string;
  matches?: Match[];
}

export default function TableAGrid({ digits, matches }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(33);
  const [cellSize, setCellSize] = useState(CELL_DESKTOP);

  useEffect(() => {
    function calc() {
      if (!containerRef.current) return;
      // Available width inside the container (minus padding)
      const w = containerRef.current.clientWidth - 24; // 12px padding each side
      const isMobile = window.innerWidth < 640;
      const size = isMobile ? CELL_MOBILE : CELL_DESKTOP;
      const columns = Math.max(10, Math.floor(w / (size + GAP)));
      setCols(columns);
      setCellSize(size);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Table A
        </h2>
        <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {digits.length.toLocaleString()} digits
          {hasHighlights && (
            <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
              {matches!.length} {matches!.length === 1 ? "match" : "matches"}
              {visibleMatches.length < matches!.length && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  {" "}({visibleMatches.length} shown)
                </span>
              )}
            </span>
          )}
        </span>
      </div>

      <div
        ref={containerRef}
        className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50"
      >
        <div
          className="grid gap-0 w-fit mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
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
                style={{ width: cellSize, height: cellSize, fontSize: cellSize < 16 ? 9 : 12 }}
                className={`flex items-center justify-center font-mono tabular-nums select-none transition-colors ${
                  isHighlighted
                    ? `${colour!.bg} ${colour!.text} font-bold ${
                        isMatchStart ? "rounded-l-sm" : ""
                      }`
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
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
