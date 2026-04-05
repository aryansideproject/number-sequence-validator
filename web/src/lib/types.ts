export interface DigitProof {
  position: number;
  tableADigit: number;
  inputDigit: number;
  validSet: number[];
}

export interface Match {
  position: number;
  row: number;
  col: number;
  tableASlice: string;
  inputSequence: string;
  proofs: DigitProof[];
}

export interface ValidationResult {
  sequence: string;
  length: number;
  totalDigits: number;
  totalMatches: number;
  matches: Match[];
}
