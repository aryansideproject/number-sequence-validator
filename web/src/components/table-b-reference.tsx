"use client";

import { useState } from "react";
import { getTableBArray } from "@/lib/table-data";

const tableBData = getTableBArray();

export default function TableBReference() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <span>{open ? "▼" : "▶"}</span>
        Table B — Cyclic Lookup (10 rows x 7 values)
      </button>

      {open && (
        <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 bg-neutral-50 dark:bg-neutral-800/50">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="pr-4 pb-1 text-xs text-neutral-400 text-left font-normal">
                  Row
                </th>
                <th className="pb-1 text-xs text-neutral-400 text-left font-normal">
                  Valid Digits
                </th>
              </tr>
            </thead>
            <tbody>
              {tableBData.map((row, idx) => (
                <tr key={idx}>
                  <td className="pr-4 text-sm font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {idx}
                  </td>
                  <td className="text-sm font-mono text-neutral-700 dark:text-neutral-300 tracking-widest">
                    {row.join("  ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
