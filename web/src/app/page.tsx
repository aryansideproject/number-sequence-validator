"use client";

import { useState, useRef } from "react";
import ValidatorInput from "@/components/validator-input";
import TableAGrid from "@/components/table-a-grid";
import { TABLE_A_FLAT } from "@/lib/table-data";
import type { ValidationResult } from "@/lib/types";

export default function Home() {
  const [tableA, setTableA] = useState(TABLE_A_FLAT);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [digitInput, setDigitInput] = useState("");
  const [addedCount, setAddedCount] = useState(0);
  const digitInputRef = useRef<HTMLInputElement>(null);

  function handleAddDigit() {
    const d = digitInput.trim();
    if (d.length !== 1 || !/^\d$/.test(d)) return;

    // Remove first digit, append new digit at the end
    setTableA((prev) => prev.slice(1) + d);
    setAddedCount((c) => c + 1);
    setDigitInput("");
    setResult(null);
    digitInputRef.current?.focus();
  }

  function handleReset() {
    setTableA(TABLE_A_FLAT);
    setAddedCount(0);
    setResult(null);
  }

  async function handleValidate(sequence: string) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence, tableA }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Validation failed.");
        return;
      }

      const data: ValidationResult = await res.json();
      setResult(data);
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          ज्योतिष ग्रह अंक
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          अंक अनुक्रम दर्ज करें और 1,005 अंकों की ग्रिड में चक्रीय तालिका से सभी मान्य मिलान खोजें।
        </p>
      </div>

      <div className="space-y-6">
        <TableAGrid digits={tableA} matches={result?.matches} />

        {/* Add digit to Table A */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Add digit to Table A:
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
              className="w-14 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-lg font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            />
            <button
              onClick={handleAddDigit}
              disabled={!/^\d$/.test(digitInput)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>

          {addedCount > 0 && (
            <>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {addedCount} {addedCount === 1 ? "digit" : "digits"} added
              </span>
              <button
                onClick={handleReset}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 transition-colors dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Reset to original
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
