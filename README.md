# STEM Pre-University Tutoring & Examination Portal

A client-side web application and academic management platform engineered for pre-university Mathematics, Physics, and Computer Science foundation curricula.

Built with React 18, Vite 6, Tailwind CSS v4, and KaTeX LaTeX rendering. Fully zero-backend and offline-capable for zero-latency hosting on Vercel, Netlify, and GitHub Pages.

---

## 🏛️ System Architecture & Modules

The platform is structured into six core operational environments:

### 1. Curriculum Lecture Handouts (`LessonView.jsx`)
- **18 In-Depth Units** spanning Calculus, Vector Algebra, Linear Systems, Classical Kinematics, Dynamics, DC/AC Circuit Networks, Electromagnetism, IEEE 754 Floating-Point Representation, Boolean Algebra, Machine Architecture, and Algorithm Complexity ($O(n)$ analysis).
- **Mathematical Typesetting**: KaTeX-driven formula rendering with inline (`$...$`) and block (`$$...$$`) math rendering.
- **Handout Mode**: Dedicated print styling (`window.print()`) optimizing page breaks and contrast for physical study guides.
- **Schematics Modal**: Scalable SVG technical diagrams and circuit schematics with full-screen inspection zoom.

### 2. Interactive Slide Decks (`SlidePresenter.jsx`)
- **Presentation Engine**: Fullscreen slide presenter with dark-room ambient ergonomics.
- **Keyboard Control Suite**:
  - `←` / `→` or `Space`: Step through slide sequence.
  - `Home` / `End`: Jump to first / last slide.
  - `N`: Toggle speaker notes drawer.
  - `G`: Toggle slide overview grid.
  - `T`: Toggle live stopwatch/timer widget.
  - `Esc`: Exit presentation or close overlays.

### 3. Problem Bank & Practice Sets (`QuestionBankView.jsx`)
- **Filterable Taxonomy**: Filter by subject (Math, Physics, CS), difficulty (Foundational, Intermediate, Advanced), and type (Multiple-Choice, Numerical with tolerance bounds, Structured Free-Response).
- **Deterministic Auto-Checking**: Instant objective verification and tolerance calculation for floating-point answers.
- **Persistence**: Starred bookmarks stored in browser `localStorage`.
- **Model Solutions**: Step-by-step mathematical derivations with complete marking rubrics.

### 4. Timed Examination Portal (`ExamPortal.jsx`)
- **Assessment Engine**: Countdown-timed candidate testing console.
- **Navigation Palette**: Real-time matrix of answered, unattempted, and flagged question statuses.
- **Auto-Scoring**: Instant scoring for objective questions with manual review flagging for extended written responses.
- **State Recovery**: Automatic exam state persistence in `localStorage` prevents data loss during browser refreshes.

### 5. Examiner Gradebook Console (`GradingDashboard.jsx`)
- **SpeedGrader Workbench**: Review candidate exam submissions with criteria-based rubric scoring.
- **Feedback Engine**: Qualitative feedback recording with automated letter grade calculation ($A^*$, $A$, $B$, $C$, $F$).
- **CSV Data Export**: RFC 4180 compliant CSV export for importing grades into external academic registries.

### 6. STEM Calculation Instruments (`InteractiveTools.jsx`)
Pure mathematical and physical calculation sandboxes backed by testable utilities (`src/utils/stemCalculators.js`):
1. **IEEE 754 32-Bit Float Decoder**: Live bitfield unpacker breaking single-precision floats into Sign, Biased Exponent (8 bits, bias 127), and Mantissa (23 bits) with exact hex translation.
2. **DC Circuit Solver**: Series/parallel resistor networks with internal battery resistance ($r$), terminal voltage drops, and branch currents via VDR/CDR.
3. **2D Kinematics Projectile Simulator**: Real-time SUVAT trajectory modeling with variable gravity, elevation, launch angle, and animated trajectory visualization.
4. **Newton-Raphson Root Solver**: Iterative numerical solver ($x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$) with convergence tables and step-by-step error tracking.
5. **2D Linear Matrix Transformation Sandbox**: Visualizes linear maps $T(\vec{x}) = A\vec{x}$ transforming basis vectors $\hat{i}, \hat{j}$ and the unit square with determinant / area deformation metrics.
6. **Digital Logic Gate Simulator**: Interactive gate engine (AND, OR, XOR, NAND, NOR, XNOR, NOT) simulating Half Adders, Full Adders, 2-to-1 Multiplexers, and De Morgan dualities.
7. **AC RLC Series Resonant Circuit Analyzer**: Phasor plane metrics computing inductive/capacitive reactance ($X_L, X_C$), total impedance ($Z$), resonant frequency ($f_0$), $Q$-factor, bandwidth, and power factor ($\cos\theta$).
8. **Bitwise Logic Sandbox**: Live 8-bit binary register visualizer performing bitwise AND, OR, XOR, NOT, left shifts (`<<`), and right shifts (`>>`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 18.3 (Single Page Application) |
| **Build & Bundler** | Vite 6.1 (with Rollup manual chunk code-splitting) |
| **Styling** | Tailwind CSS v4 (Obsidian / zinc engineering palette) |
| **Mathematics Engine** | KaTeX 0.16 |
| **Test Runner** | Vitest 5.0 (Unit and regression test suites) |
| **Icons** | Lucide React |
| **CI / CD** | GitHub Actions (Node.js 18.x, 20.x, 22.x matrix) |

---

## 🧪 Testing & SDLC

The codebase adheres to clean separation of concerns: pure algorithmic logic is isolated in `src/utils/` and covered by automated Vitest suites.

### Running Tests

```bash
# Execute unit test suite once
npm test

# Run tests in interactive watch mode
npm run test:watch
```

### Test Coverage Areas
- **`src/__tests__/stemCalculators.test.js`**:
  - IEEE 754 float bit packing, decoding, sign extraction, and NaN handling.
  - DC series and parallel circuit networks with internal battery resistance.
  - Symmetrical and elevated 2D SUVAT projectile flight times and peak ranges.
  - Newton-Raphson polynomial convergence and zero-derivative divergence protection.
  - AC RLC resonance frequency, impedance matching, and phasor angle calculation.
- **`src/__tests__/gradingEngine.test.js`**:
  - Multiple-choice correct/incorrect scoring.
  - Numerical answer tolerance boundaries ($\pm \delta$).
  - Free-response manual review classification.
  - Batch exam score aggregation and percentage metrics.
  - Letter grade boundaries ($A^*, A, B, C, F$).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Local Development

```bash
# 1. Clone repository
git clone <repository-url>
cd tuts-portal

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore the portal.

### Production Build

```bash
npm run build
```

Generates optimized, tree-shaken static bundles in `dist/` with isolated vendor chunks (`vendor-react`, `vendor-katex`, `vendor-icons`).

---

## 🌐 Zero-Backend Production Deployment

Because all data persists client-side via browser `localStorage` and all calculations run in pure WebAssembly/JavaScript, the application requires zero database setup or backend servers.

### Deploy to Vercel
1. Push repository to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Deploy to Netlify
1. Push repository to GitHub.
2. Import repository into [Netlify](https://netlify.com).
3. Build Command: `npm run build`
4. Publish Directory: `dist`

### Deploy to GitHub Pages
1. Configure `base: './'` in `vite.config.js`.
2. Build static bundle: `npm run build`.
3. Deploy the `dist` directory to your repository's `gh-pages` branch.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
