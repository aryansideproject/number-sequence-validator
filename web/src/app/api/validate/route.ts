import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/lib/validator";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const sequence = body.sequence?.trim();
  const tableA = body.tableA?.trim();

  if (!sequence || !/^\d+$/.test(sequence)) {
    return NextResponse.json(
      { error: "Input must be digits only." },
      { status: 400 }
    );
  }

  const maxLen = tableA ? tableA.length : 1005;
  if (sequence.length < 1 || sequence.length > maxLen) {
    return NextResponse.json(
      { error: `Sequence length must be between 1 and ${maxLen}.` },
      { status: 400 }
    );
  }

  const result = validate(sequence, tableA || undefined);
  return NextResponse.json(result);
}
