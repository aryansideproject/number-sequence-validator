# Number Sequence Validator
**Project**: Number Sequence Validation System
**Type**: Web app + Python backend — two-table cyclic matching
**Created**: 5 April 2026
**Status**: Phase 1 complete (CLI), Phase 2 next (web app)
**GitHub**: https://github.com/aryansideproject/number-sequence-validator
**Git account**: aryansideproject (side project token)
**Push command**: `source ~/.claude/env/side-project.env && git push origin main`

---

## How It Works

### Table A (Big Table)
- 67 rows × 15 digits = 1,005 digits (flattened into one continuous stream)
- Rows are concatenated left to right without gaps to form a square grid
- Read left to right, row by row — no gaps, no skipping

### Table B (Small Table — Cyclic Lookup)
- 10 rows (0–9), each row has 7 values — NEVER modify this table
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

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router) | Fast, modern, easy deploy |
| Styling | Tailwind CSS | Clean, responsive |
| Backend / API | Next.js API routes | No separate server needed |
| Core logic | TypeScript port of validator.py | Runs in API route, no Python dependency |
| Deployment | Vercel | Instant deploy from git |

---

## 🎨 Web App Design

### Pages
- **`/`** — Landing + validator tool (single page app)
  - Input field for digit sequence
  - "Validate" button
  - Results panel showing matches with position + proof
  - Table A and Table B displayed for reference (collapsible)

### UI Components
- **Input section** — large input field, example sequences as quick-fill buttons
- **Results card** — total count, scrollable list of matches
- **Match detail** — position (row/col), Table A digits vs input digits, per-digit ✓ proof
- **Table viewers** — Table A as a grid (highlight matching positions), Table B as reference
- **How it works** — simple explainer section

### UX Rules
- Single page — no navigation needed
- Instant results (runs client-side or fast API call)
- Mobile responsive
- Professional dark/light theme
- Highlight matching positions on the Table A grid visually

---

## 📁 Project Structure

```
number-sequence-validator/
├── CLAUDE.md
├── validator.py              ← Original CLI (Phase 1 — done)
├── data/
│   ├── table_a.txt
│   └── table_b.txt
├── web/                      ← Next.js web app (Phase 2)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      ← Main page (input + results + tables)
│   │   │   ├── layout.tsx
│   │   │   └── api/
│   │   │       └── validate/
│   │   │           └── route.ts  ← Validation API endpoint
│   │   ├── components/
│   │   │   ├── validator-input.tsx
│   │   │   ├── results-panel.tsx
│   │   │   ├── match-detail.tsx
│   │   │   ├── table-a-grid.tsx
│   │   │   └── table-b-reference.tsx
│   │   ├── lib/
│   │   │   ├── validator.ts      ← Core logic (TS port)
│   │   │   ├── table-data.ts     ← Table A + B as constants
│   │   │   └── types.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── .gitignore
```

---

## 🚦 Build Phases

| Phase | What | Status |
|---|---|---|
| Phase 1 | Python CLI validator | ✅ Done |
| Phase 2 | Next.js web app — input, validate, show results with proof | ⏳ Next |
| Phase 3 | Visual Table A grid with match highlighting | ⏳ |
| Phase 4 | Deploy to Vercel, polish UI | ⏳ |

### Phase 2 — Web App (Next)
1. Create Next.js 15 project in `web/`
2. Port `validator.py` logic to TypeScript (`lib/validator.ts`)
3. Embed Table A + Table B data as constants (`lib/table-data.ts`)
4. Build API route `/api/validate` — accepts `{ sequence: string }`, returns matches
5. Build main page with input field, validate button, results panel
6. Each result shows position, Table A digits, input digits, per-digit proof

### Phase 3 — Visual Grid
1. Render Table A as a visual grid on the page
2. Highlight matched positions when results are shown
3. Table B shown as a fixed reference panel

### Phase 4 — Deploy
1. Deploy `web/` to Vercel
2. Polish responsive design
3. Add dark/light theme toggle

---

## 🚫 Rules
- NEVER modify Table B — it is the fixed cyclic lookup
- Table A must be read exactly as provided — no reordering
- Matching must be strictly sequential (no skipping)
- Always move forward (left to right) in Table A
- Side project — push to aryansideproject only
