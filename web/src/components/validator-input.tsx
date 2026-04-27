"use client";

import { useState } from "react";

const EXAMPLES = ["1395672", "105079", "999", "12345", "0000"];

interface Props {
  onValidate: (sequence: string) => void;
  onClear: () => void;
  loading: boolean;
  hasResults: boolean;
}

export default function ValidatorInput({ onValidate, onClear, loading, hasResults }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const seq = input.trim();
    if (!seq) {
      setError("Please enter a digit sequence.");
      return;
    }
    if (!/^\d+$/.test(seq)) {
      setError("Input must contain digits only (0-9).");
      return;
    }
    setError("");
    onValidate(seq);
  }

  function handleQuickFill(seq: string) {
    setInput(seq);
    setError("");
    onValidate(seq);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Enter digit sequence"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 pr-9 sm:px-4 sm:py-3 sm:pr-10 text-base sm:text-lg font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            autoFocus
          />
          {input && (
            <>
              <span className="absolute right-9 sm:right-10 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 dark:text-neutral-500 pointer-events-none">
                {input.replace(/\D/g, "").length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setError("");
                  onClear();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 dark:hover:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-neutral-900"
        >
          {loading ? "Validating..." : "Validate"}
        </button>
        {hasResults && (
          <button
            type="button"
            onClick={() => {
              setInput("");
              setError("");
              onClear();
            }}
            className="rounded-lg border border-red-300 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-medium text-red-600 hover:bg-red-50 transition-colors dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 self-center">
          Try:
        </span>
        {EXAMPLES.map((seq) => (
          <button
            key={seq}
            onClick={() => handleQuickFill(seq)}
            className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs sm:text-sm font-mono text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-colors dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            {seq}
          </button>
        ))}
      </div>
    </div>
  );
}
