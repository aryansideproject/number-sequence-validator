"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

const CELL_SIZES = [12, 16, 20, 26];
const DEFAULT_MOBILE = 1; // index 1 = 16px
const DEFAULT_DESKTOP = 2; // index 2 = 20px

interface Props {
  digits: string;
  matches?: Match[];
}

export default function TableAGrid({ digits, matches }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizeIdx, setSizeIdx] = useState(DEFAULT_DESKTOP);
  const [cols, setCols] = useState(33);

  const cellSize = CELL_SIZES[sizeIdx];

  const recalcCols = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 24;
    const columns = Math.max(10, Math.floor(w / cellSize));
    setCols(columns);
  }, [cellSize]);

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) setSizeIdx(DEFAULT_MOBILE);
  }, []);

  useEffect(() => {
    recalcCols();
    window.addEventListener("resize", recalcCols);
    return () => window.removeEventListener("resize", recalcCols);
  }, [recalcCols]);

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
  const fontSize = cellSize <= 12 ? 8 : cellSize <= 16 ? 11 : cellSize <= 20 ? 13 : 16;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Table A
          </h2>
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSizeIdx((i) => Math.max(0, i - 1))}
              disabled={sizeIdx === 0}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              -
            </button>
            <button
              onClick={() => setSizeIdx((i) => Math.min(CELL_SIZES.length - 1, i + 1))}
              disabled={sizeIdx === CELL_SIZES.length - 1}
              className="w-7 h-7 flex items-center justify-center rounded border border-neutral-300 text-sm text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              +
            </button>
          </div>
        </div>
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
        className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50 overflow-x-auto"
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
                style={{ width: cellSize, height: cellSize, fontSize }}
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
