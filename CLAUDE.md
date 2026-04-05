# Number Sequence Validator
**Project**: Number Sequence Validation System
**Type**: Python CLI tool — two-table cyclic matching
**Created**: 5 April 2026
**GitHub**: https://github.com/aryansideproject/number-sequence-validator
**Git account**: aryansideproject (side project token)
**Push command**: `source ~/.claude/env/side-project.env && git push origin main`

## How It Works

### Table A (Big Table)
- 67 rows × 15 digits = 1,005 digits (flattened into one continuous stream)
- Read left to right, row by row — no gaps, no skipping

### Table B (Small Table — Cyclic Lookup)
- 10 rows (0–9), each row has 7 values
- Row x = {x, x+1, x+2, x+3, x+4, x+5, x+6} mod 10
- Row 0 → 0 1 2 3 4 5 6
- Row 3 → 3 4 5 6 7 8 9
- Row 9 → 9 0 1 2 3 4 5

### Validation Logic
1. Input = a sequence of k digits
2. Slide a window of size k across Table A (continuous, left to right)
3. At each window position, for each digit j:
   - x = Table A digit at position (i + j)
   - d = Input digit at position j
   - Check: d must exist in Table B row x
4. If ALL k digits match → valid sequence
5. Continue scanning to find all valid sequences

### Output
- Total valid sequence count
- Each match with position, Table A digits, and per-digit validation proof

## Usage
```bash
python3 validator.py 1395672
python3 validator.py    # interactive prompt
```

## Files
```
number-sequence-validator/
├── CLAUDE.md
├── validator.py        ← Main script
├── data/
│   ├── table_a.txt     ← Big table (67 rows × 15 digits)
│   └── table_b.txt     ← Small table (10 rows × 7 digits)
└── .gitignore
```
