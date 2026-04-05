"use client";

import { useState } from "react";

const EXAMPLES = ["1395672", "105079", "999", "12345", "0000"];

interface Props {
  onValidate: (sequence: string) => void;
  loading: boolean;
}

export default function ValidatorInput({ onValidate, loading }: Props) {
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
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder="Enter digit sequence (e.g. 1395672)"
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-lg font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:focus:ring-offset-neutral-900"
        >
          {loading ? "Validating..." : "Validate"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400 self-center">
          Try:
        </span>
        {EXAMPLES.map((seq) => (
          <button
            key={seq}
            onClick={() => handleQuickFill(seq)}
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm font-mono text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-colors dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            {seq}
          </button>
        ))}
      </div>
    </div>
  );
}
