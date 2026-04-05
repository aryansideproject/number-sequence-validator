"use client";

import { useState } from "react";
import type { Match } from "@/lib/types";

export default function MatchDetail({
  match,
  index,
}: {
  match: Match;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            #{index + 1}
          </span>
          <span className="font-mono text-sm text-neutral-900 dark:text-neutral-100">
            Pos {match.position}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Row {match.row}, Col {match.col}
          </span>
        </div>
        <span className="text-neutral-400 text-sm">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-neutral-100 dark:border-neutral-700 pt-3 space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm font-mono">
            <span className="text-neutral-500 dark:text-neutral-400">
              Table A:
            </span>
            <span className="text-neutral-900 dark:text-neutral-100 tracking-wider">
              {match.tableASlice}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              Input:
            </span>
            <span className="text-blue-600 dark:text-blue-400 tracking-wider">
              {match.inputSequence}
            </span>
          </div>

          <div className="space-y-1">
            {match.proofs.map((proof) => (
              <div
                key={proof.position}
                className="flex items-center gap-2 text-xs font-mono"
              >
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  d={proof.inputDigit} ∈ row({proof.tableADigit}) ={" "}
                  {"{"}{proof.validSet.join(", ")}{"}"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
