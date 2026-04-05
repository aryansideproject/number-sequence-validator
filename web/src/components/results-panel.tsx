"use client";

import type { ValidationResult } from "@/lib/types";
import MatchDetail from "./match-detail";

export default function ResultsPanel({ result }: { result: ValidationResult }) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Results
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {result.totalMatches}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {result.totalMatches === 1 ? "match" : "matches"} found
          </span>
        </div>
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Searched {result.totalDigits} digits for sequence &ldquo;
        <span className="font-mono text-neutral-700 dark:text-neutral-300">
          {result.sequence}
        </span>
        &rdquo; (length {result.length})
      </p>

      {result.totalMatches === 0 ? (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No valid sequences found for this input.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {result.matches.map((match, i) => (
            <MatchDetail key={match.position} match={match} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
