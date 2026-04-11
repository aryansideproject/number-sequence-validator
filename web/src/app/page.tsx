"use client";

import { useState, useRef } from "react";
import ValidatorInput from "@/components/validator-input";
import TableAGrid from "@/components/table-a-grid";
import { TABLES } from "@/lib/table-data";
import { validate } from "@/lib/validator";
import type { ValidationResult } from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [tableDigits, setTableDigits] = useState(() =>
    TABLES.map((t) => t.flat)
  );
  const [results, setResults] = useState<(ValidationResult | null)[]>(
    () => TABLES.map(() => null)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [digitInput, setDigitInput] = useState("");
  const [addedCounts, setAddedCounts] = useState(() =>
    TABLES.map(() => 0)
  );
  const digitInputRef = useRef<HTMLInputElement>(null);

  const currentDigits = tableDigits[activeTab];
  const currentResult = results[activeTab];
  const currentAdded = addedCounts[activeTab];

  function handleTabChange(idx: number) {
    setActiveTab(idx);
    setError("");
  }

  function handleAddDigit() {
    const d = digitInput.trim();
    if (d.length !== 1 || !/^\d$/.test(d)) return;

    setTableDigits((prev) => {
      const next = [...prev];
      next[activeTab] = next[activeTab].slice(1) + d;
      return next;
    });
    setAddedCounts((prev) => {
      const next = [...prev];
      next[activeTab] = next[activeTab] + 1;
      return next;
    });
    setResults((prev) => {
      const next = [...prev];
      next[activeTab] = null;
      return next;
    });
    setDigitInput("");
    digitInputRef.current?.focus();
  }

  function handleReset() {
    setTableDigits((prev) => {
      const next = [...prev];
      next[activeTab] = TABLES[activeTab].flat;
      return next;
    });
    setAddedCounts((prev) => {
      const next = [...prev];
      next[activeTab] = 0;
      return next;
    });
    setResults((prev) => {
      const next = [...prev];
      next[activeTab] = null;
      return next;
    });
  }

  function handleValidate(sequence: string) {
    setLoading(true);
    setError("");

    try {
      const data = validate(sequence, currentDigits);
      setResults((prev) => {
        const next = [...prev];
        next[activeTab] = data;
        return next;
      });
    } catch {
      setError("Validation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-12">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-1 sm:mb-2">
          ज्योतिष ग्रह अंक
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          अंक अनुक्रम दर्ज करें और ग्रिड में चक्रीय तालिका से सभी मान्य मिलान खोजें।
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-4 sm:mb-6">
        {TABLES.map((table, idx) => (
          <button
            key={table.id}
            onClick={() => handleTabChange(idx)}
            className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors relative ${
              activeTab === idx
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {table.label}
            {activeTab === idx && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <TableAGrid digits={currentDigits} matches={currentResult?.matches} />

        {/* Add digit */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Add digit:
          </span>
          <div className="flex gap-2">
            <input
              ref={digitInputRef}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digitInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d$/.test(v)) setDigitInput(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddDigit();
              }}
              placeholder="0-9"
              className="w-12 sm:w-14 rounded-lg border border-neutral-300 bg-white px-2 sm:px-3 py-2 text-center text-base sm:text-lg font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            />
            <button
              onClick={handleAddDigit}
              disabled={!/^\d$/.test(digitInput)}
              className="rounded-lg bg-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          {currentAdded > 0 && (
            <>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {currentAdded} added
              </span>
              <button
                onClick={handleReset}
                className="rounded-lg border border-neutral-300 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 transition-colors dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Reset
              </button>
            </>
          )}
        </div>

        <ValidatorInput onValidate={handleValidate} loading={loading} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
