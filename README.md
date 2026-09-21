# STEM Pre-University Tutoring & Examination Portal

A modern, full-featured web portal for Mathematics, Physics, and Computer Science foundation tutoring, interactive presentations, question banks, timed examinations, and rubric-based grading.

## 🚀 Features

- **📚 Structured Lesson Explorer**: Complete curriculum notes with KaTeX mathematical formulas and technical schematics.
- **🖥️ Fullscreen Slide Presenter**: Keyboard-driven slide decks (`←` / `→` / `Space`), speaker notes drawer (`N`), and overview grid (`G`).
- **📝 Interactive Question Bank**: Filterable practice questions (MCQ, Numeric, Free-Response) with instant feedback and step-by-step model derivations.
- **⏱️ Timed Examination Portal**: Formal test environments with countdown timers, question navigation drawers, auto-scoring, and state recovery.
- **📊 Tutor Grading Console & Gradebook**: Candidate submission review workbench, criteria-based rubric scoring, qualitative feedback, and CSV gradebook export.
- **⚡ Interactive STEM Simulators**: Live DC Circuit (VDR/CDR) solver, IEEE 754 32-bit floating-point bit unpacker, and bitwise logic sandbox.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Math Engine**: KaTeX LaTeX equation rendering
- **Icons**: Lucide React
- **Storage & State**: Browser LocalStorage with CSV Gradebook export

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## 🌐 Deployment

### Deploy to Vercel
1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Deploy to Netlify
1. Push this repository to GitHub.
2. Import repository into [Netlify](https://netlify.com).
3. Build Command: `npm run build`
4. Publish Directory: `dist`
