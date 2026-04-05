#!/usr/bin/env python3
"""
Number Sequence Validator
Validates input sequences against Table A (big grid) and Table B (cyclic lookup).

Logic:
1. Flatten Table A into a continuous digit stream (left to right, row by row)
2. Table B: Row x = {x, x+1, x+2, x+3, x+4, x+5, x+6} mod 10
3. Slide a window of length k across Table A
4. At each position, check if every input digit exists in the corresponding
   Table B row (where the row is determined by the Table A digit)
5. If ALL digits satisfy → valid sequence
"""

import sys
import os


def load_table_a(filepath):
    """Load Table A and flatten into a single digit string."""
    digits = []
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            # Strip row numbers if present (e.g., "1\t105079553597265")
            parts = line.split()
            row_digits = parts[-1]  # Take the last part (digits only)
            digits.append(row_digits)
    return ''.join(digits)


def build_table_b():
    """
    Build Table B: 10 rows, each row x = {x, x+1, ..., x+6} mod 10.
    Returns a dict: row_index -> set of valid digits.
    """
    table = {}
    for x in range(10):
        table[x] = set((x + offset) % 10 for offset in range(7))
    return table


def validate_sequence(input_seq, table_a_digits, table_b):
    """
    Slide a window of length k across Table A.
    At each position i, check if input_seq[j] is in Table B[table_a_digit[i+j]]
    for all j in [0, k).

    Returns:
        valid_sequences: list of (position, big_table_slice) tuples
    """
    k = len(input_seq)
    n = len(table_a_digits)
    input_digits = [int(d) for d in input_seq]
    big_digits = [int(d) for d in table_a_digits]
    valid_sequences = []

    for i in range(n - k + 1):
        match = True
        for j in range(k):
            x = big_digits[i + j]       # Table A digit at position (i + j)
            d = input_digits[j]          # Input digit at position j
            if d not in table_b[x]:      # Check if d exists in row x of Table B
                match = False
                break
        if match:
            seq_from_table = table_a_digits[i:i + k]
            valid_sequences.append((i, seq_from_table))

    return valid_sequences


def main():
    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    table_a_path = os.path.join(script_dir, 'data', 'table_a.txt')

    # Get input
    if len(sys.argv) > 1:
        input_seq = sys.argv[1].strip()
    else:
        input_seq = input("Enter digit sequence to validate: ").strip()

    # Validate input is digits only
    if not input_seq.isdigit():
        print(f"Error: Input must be digits only. Got: '{input_seq}'")
        sys.exit(1)

    k = len(input_seq)
    print(f"\nInput sequence: {input_seq}")
    print(f"Sequence length: {k}")
    print(f"{'─' * 50}")

    # Load data
    table_a_digits = load_table_a(table_a_path)
    table_b = build_table_b()

    print(f"Table A: {len(table_a_digits)} digits (flattened)")
    print(f"Table B: 10 rows × 7 cyclic values")
    print(f"{'─' * 50}")

    # Show Table B for reference
    print("\nTable B (Row → Valid Digits):")
    for x in range(10):
        vals = sorted(table_b[x])
        print(f"  Row {x}: {' '.join(str(v) for v in vals)}")
    print()

    # Validate
    results = validate_sequence(input_seq, table_a_digits, table_b)

    # Output
    print(f"{'─' * 50}")
    print(f"RESULTS")
    print(f"{'─' * 50}")
    print(f"Total valid sequences found: {len(results)}")
    print()

    if results:
        for idx, (pos, seq) in enumerate(results, 1):
            row = pos // 15
            col = pos % 15
            print(f"  #{idx}  Position: {pos} (Row {row + 1}, Col {col + 1})")
            print(f"       Table A digits: {seq}")
            print(f"       Input digits:   {input_seq}")

            # Show the matching detail
            detail = []
            for j in range(k):
                x = int(seq[j])
                d = int(input_seq[j])
                detail.append(f"d={d} ∈ row({x})={sorted(table_b[x])}")
            print(f"       Validation:")
            for d in detail:
                print(f"         ✓ {d}")
            print()
    else:
        print("  No valid sequences found for the given input.")


if __name__ == '__main__':
    main()
