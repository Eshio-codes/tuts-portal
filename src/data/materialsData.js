/**
 * MATERIALS DATA REGISTRY
 * Maps all original tutoring syllabus files, lecture notes, slide decks,
 * assignments, and worked examples from C:\Users\USER\Documents\Tuts into
 * the portal's client-side download repository.
 */

export const COURSE_MATERIALS = [
  // GENERAL / MASTER SYLLABUS
  {
    id: 'mat-gen-01',
    subject: 'general',
    courseName: 'All Tracks (Math, Physics, CS)',
    session: 'Master Roadmap',
    title: '8-Week Foundation Sprint Master Teaching Plan',
    fileName: 'Teaching plan.pdf',
    fileType: 'PDF',
    fileSize: '672 KB',
    downloadUrl: '/materials/general/Teaching plan.pdf',
    description: 'Complete 8-week multi-disciplinary curriculum blueprint covering all 24 intensive sessions across Calculus, Mechanics & Circuits, and Computer Systems & Algorithms.',
    badge: 'Master Syllabus',
    tags: ['Curriculum', 'Syllabus', 'Roadmap', 'Assessment Plan'],
    dateAdded: '2026-08-23'
  },

  // MATHEMATICS MATERIALS
  {
    id: 'mat-math-01',
    subject: 'math',
    courseName: 'Mathematics',
    session: 'Unit 1 (Sessions 1-2)',
    title: 'Unit 1 Lecture Handout: Limits & Continuity',
    fileName: 'Math unit 1 limits.pdf',
    fileType: 'PDF',
    fileSize: '474 KB',
    downloadUrl: '/materials/math/Math unit 1 limits.pdf',
    description: 'Comprehensive lecture notes, formal algebraic limit theorems, conjugate rationalization techniques, epsilon-delta definitions, and homework problem sets.',
    badge: 'Lecture Notes & Homework',
    tags: ['Limits', 'Continuity', 'Calculus', 'Squeeze Theorem'],
    dateAdded: '2026-08-23'
  },
  {
    id: 'mat-math-02',
    subject: 'math',
    courseName: 'Mathematics',
    session: 'Unit 1 (Session 3)',
    title: 'Differential Calculus: Chain Rule & Higher-Order Derivations',
    fileName: 'Tuts exp 1.docx',
    fileType: 'DOCX',
    fileSize: '16 KB',
    downloadUrl: '/materials/math/Tuts exp 1.docx',
    description: 'In-depth derivation sheet covering composite function differentiation via the Chain Rule, trigonometric/exponential derivatives, and nth-order successive differentiation.',
    badge: 'Derivation Sheet',
    tags: ['Derivatives', 'Chain Rule', 'Higher Order', 'Worked Solutions'],
    dateAdded: '2026-09-05'
  },

  // PHYSICS MATERIALS
  {
    id: 'mat-phys-01',
    subject: 'physics',
    courseName: 'Physics',
    session: 'Unit 1 (Sessions 1-2)',
    title: 'Unit 1 Lecture Handout: Kinematics in 1D & 2D',
    fileName: 'Physics unit 1 Kinematics.pdf',
    fileType: 'PDF',
    fileSize: '690 KB',
    downloadUrl: '/materials/physics/Physics unit 1 Kinematics.pdf',
    description: 'Detailed textbook notes on rectilinear motion, uniform acceleration equations, graphical gradient/area calculus, vertical projectile free-fall, and 2D trajectory kinematics.',
    badge: 'Lecture Notes & Homework',
    tags: ['Kinematics', 'Equations of Motion', 'v-t Graphs', 'Projectiles'],
    dateAdded: '2026-08-23'
  },
  {
    id: 'mat-phys-02',
    subject: 'physics',
    courseName: 'Physics',
    session: 'Unit 1 (Session 3)',
    title: 'Session 3 Slide Deck: 2D Projectile Motion & Vector Trajectories',
    fileName: 'Physics_Session3_Deck.pptx',
    fileType: 'PPTX',
    fileSize: '251 KB',
    downloadUrl: '/materials/physics/Physics_Session3_Deck.pptx',
    description: 'Examiner lecture slide deck detailing orthogonal velocity decomposition, parabolic trajectory equations, time-of-flight derivations, and launch angle optimization.',
    badge: 'Lecture Presentation Deck',
    tags: ['Projectiles', 'Slide Deck', 'Vector Calculus', 'Mechanics'],
    dateAdded: '2026-09-14'
  },

  // COMPUTER SCIENCE MATERIALS
  {
    id: 'mat-cs-01',
    subject: 'cs',
    courseName: 'Computer Science',
    session: 'Unit 1 (Sessions 1-2)',
    title: 'Unit 1 Lecture Handout: Python Programming Fundamentals',
    fileName: 'CS unit 1 Programming fundamentals.pdf',
    fileType: 'PDF',
    fileSize: '692 KB',
    downloadUrl: '/materials/cs/CS unit 1 Programming fundamentals.pdf',
    description: 'Rigorous foundation handout covering Python variable semantics, operators, nested conditional branching, loop constructs, and step-by-step memory trace table execution.',
    badge: 'Lecture Notes & Guide',
    tags: ['Python', 'Control Flow', 'Loops', 'Trace Tables'],
    dateAdded: '2026-08-23'
  },
  {
    id: 'mat-cs-02',
    subject: 'cs',
    courseName: 'Computer Science',
    session: 'Unit 1 (Session 3)',
    title: 'Session 3 Slide Deck: Control Structures, Nested Iteration & Trace Tables',
    fileName: 'CS_Session3_Deck.pptx',
    fileType: 'PPTX',
    fileSize: '352 KB',
    downloadUrl: '/materials/cs/CS_Session3_Deck.pptx',
    description: 'Classroom slide deck detailing loop invariants, nested while/for execution dry runs, trace table methodologies, and algorithmic time complexity analysis.',
    badge: 'Lecture Presentation Deck',
    tags: ['Algorithms', 'Slide Deck', 'Trace Tables', 'Iteration'],
    dateAdded: '2026-09-14'
  },
  {
    id: 'mat-cs-03',
    subject: 'cs',
    courseName: 'Computer Science',
    session: 'Week 1 Assignment',
    title: 'Week 1 Graded Assignment: CPU Architecture & 2\'s Complement Arithmetic',
    fileName: 'CS Assignment week 1.pdf',
    fileType: 'PDF',
    fileSize: '1.02 MB',
    downloadUrl: '/materials/cs/CS Assignment week 1.pdf',
    description: 'Formal graded problem set evaluating Von Neumann registers (PC, MAR, MDR, CIR, ACC), Fetch-Decode-Execute micro-operations, and signed Two\'s Complement binary arithmetic.',
    badge: 'Graded Assignment',
    tags: ['Von Neumann', 'Fetch-Decode-Execute', 'Two\'s Complement', 'Registers'],
    dateAdded: '2026-08-23'
  },
  {
    id: 'mat-cs-04',
    subject: 'cs',
    courseName: 'Computer Science',
    session: 'Week 1 Assignment (Supplementary)',
    title: 'Week 1 Supplementary Problem Sheet: Computer Systems Architecture',
    fileName: 'CS Assignment week 1_1.pdf',
    fileType: 'PDF',
    fileSize: '645 KB',
    downloadUrl: '/materials/cs/CS Assignment week 1_1.pdf',
    description: 'Supplementary assessment sheet with additional practice problems on register transfer notation, address bus bandwidth calculations, and signed arithmetic overflow checks.',
    badge: 'Supplementary Sheet',
    tags: ['Architecture', 'Register Transfer', 'Overflow', 'Binary Arithmetic'],
    dateAdded: '2026-08-23'
  }
];

export function getMaterialsBySubject(subject) {
  if (!subject || subject === 'all') return COURSE_MATERIALS;
  return COURSE_MATERIALS.filter((m) => m.subject === subject || m.subject === 'general');
}

export function getMaterialsBySession(subject, sessionNumber) {
  return COURSE_MATERIALS.filter(
    (m) => m.subject === subject && m.session.includes(String(sessionNumber))
  );
}
