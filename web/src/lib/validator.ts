import { COLS_PER_ROW, buildTableB } from "./table-data";
import type { Match, DigitProof, ValidationResult } from "./types";

const tableB = buildTableB();

export function validate(sequence: string, tableADigits: string): ValidationResult {
  const tableA = tableADigits;
  const k = sequence.length;
  const n = tableA.length;
  const inputDigits = Array.from(sequence, Number);
  const bigDigits = Array.from(tableA, Number);
  const matches: Match[] = [];

  for (let i = 0; i <= n - k; i++) {
    let valid = true;
    const proofs: DigitProof[] = [];

    for (let j = 0; j < k; j++) {
      const x = bigDigits[i + j];
      const d = inputDigits[j];
      const validSet = tableB.get(x)!;

      if (!validSet.has(d)) {
        valid = false;
        break;
      }

      proofs.push({
        position: j,
        tableADigit: x,
        inputDigit: d,
        validSet: Array.from(validSet).sort((a, b) => a - b),
      });
    }

    if (valid) {
      const row = Math.floor(i / COLS_PER_ROW);
      const col = i % COLS_PER_ROW;
      matches.push({
        position: i,
        row: row + 1,
        col: col + 1,
        tableASlice: tableA.slice(i, i + k),
        inputSequence: sequence,
        proofs,
      });
    }
  }

  return {
    sequence,
    length: k,
    totalDigits: n,
    totalMatches: matches.length,
    matches,
  };
}
