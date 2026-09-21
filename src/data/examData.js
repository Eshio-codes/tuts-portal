export const EXAMS = [
  {
    id: 'exam-math-mastery',
    title: 'Mathematics Unit Mastery Examination',
    subject: 'math',
    timeLimitMinutes: 90,
    totalPoints: 160,
    description: 'Comprehensive 40-question examination covering Functions, Limits, Differential Calculus, Optimization, Integral Calculus, Vectors, and Numerical Methods.',
    instructions: 'All questions are deterministic Multiple Choice or Precision Numeric answers. Active anti-cheat proctoring is enabled.',
    sections: [
      {
        id: 'sec-math-1',
        title: 'Part 1: Functions, Domain/Range & Limits',
        points: 40,
        questions: ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10']
      },
      {
        id: 'sec-math-2',
        title: 'Part 2: Derivatives, Chain Rule & Tangents',
        points: 40,
        questions: ['m11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20']
      },
      {
        id: 'sec-math-3',
        title: 'Part 3: Definite/Indefinite Integrals & Applications',
        points: 40,
        questions: ['m21', 'm22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm30']
      },
      {
        id: 'sec-math-4',
        title: 'Part 4: Linear Algebra, Vectors & Numerical Methods',
        points: 40,
        questions: ['m31', 'm32', 'm33', 'm34', 'm35', 'm36', 'm37', 'm38', 'm39', 'm40']
      }
    ]
  },
  {
    id: 'exam-physics-mastery',
    title: 'Physics Unit Mastery Examination',
    subject: 'physics',
    timeLimitMinutes: 90,
    totalPoints: 160,
    description: 'Comprehensive 40-question examination covering 1D/2D Kinematics, Projectiles, Newton\'s Laws, Work-Energy, Momentum, Rotational Dynamics, and DC/AC Circuits.',
    instructions: 'All calculation questions require exact numeric values or multiple-choice selections with appropriate SI units. Active anti-cheat proctoring is enabled.',
    sections: [
      {
        id: 'sec-phys-1',
        title: 'Part 1: 1D & 2D Kinematics & Projectiles',
        points: 40,
        questions: ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10']
      },
      {
        id: 'sec-phys-2',
        title: 'Part 2: Dynamics, Newton\'s Laws & Work-Energy',
        points: 40,
        questions: ['p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20']
      },
      {
        id: 'sec-phys-3',
        title: 'Part 3: Momentum, Collisions & Rotational Physics',
        points: 40,
        questions: ['p21', 'p22', 'p23', 'p24', 'p25', 'p26', 'p27', 'p28', 'p29', 'p30']
      },
      {
        id: 'sec-phys-4',
        title: 'Part 4: DC Circuit Networks, Dividers & AC Resonators',
        points: 40,
        questions: ['p31', 'p32', 'p33', 'p34', 'p35', 'p36', 'p37', 'p38', 'p39', 'p40']
      }
    ]
  },
  {
    id: 'exam-cs-mastery',
    title: 'Computer Science Unit Mastery Examination',
    subject: 'cs',
    timeLimitMinutes: 100,
    totalPoints: 200,
    description: 'Comprehensive 50-question examination covering CPU Architecture, Number Systems, 2\'s Complement, IEEE 754 Floating-Point, Bitwise Logic, Python Programming, Algorithmic Complexity, and Logic Gates.',
    instructions: 'Deterministic multiple-choice and numeric code outputs. Active anti-cheat proctoring is enabled.',
    sections: [
      {
        id: 'sec-cs-1',
        title: 'Part 1: Von Neumann Architecture & Number Bases',
        points: 40,
        questions: ['cs01', 'cs02', 'cs03', 'cs04', 'cs05', 'cs06', 'cs07', 'cs08', 'cs09', 'cs10']
      },
      {
        id: 'sec-cs-2',
        title: 'Part 2: Two\'s Complement & IEEE 754 Floating Point',
        points: 40,
        questions: ['cs11', 'cs12', 'cs13', 'cs14', 'cs15', 'cs16', 'cs17', 'cs18', 'cs19', 'cs20']
      },
      {
        id: 'sec-cs-3',
        title: 'Part 3: Bitwise Operations & Python Fundamentals',
        points: 40,
        questions: ['cs21', 'cs22', 'cs23', 'cs24', 'cs25', 'cs26', 'cs27', 'cs28', 'cs29', 'cs30']
      },
      {
        id: 'sec-cs-4',
        title: 'Part 4: Loops, Functions, Recursion & Scoping',
        points: 40,
        questions: ['cs31', 'cs32', 'cs33', 'cs34', 'cs35', 'cs36', 'cs37', 'cs38', 'cs39', 'cs40']
      },
      {
        id: 'sec-cs-5',
        title: 'Part 5: Algorithms, Complexity & Digital Logic Gates',
        points: 40,
        questions: ['cs41', 'cs42', 'cs43', 'cs44', 'cs45', 'cs46', 'cs47', 'cs48', 'cs49', 'cs50']
      }
    ]
  },
  {
    id: 'exam-stem-s2',
    title: 'STEM Sprint Combined Assessment',
    subject: 'combined',
    timeLimitMinutes: 60,
    totalPoints: 120,
    description: '30-question cross-disciplinary exam testing core Mathematics limits, Physics circuits/kinematics, and CS data representation.',
    instructions: '10 questions per subject section. Active anti-cheat proctoring enabled.',
    sections: [
      {
        id: 'sec-stem-math',
        title: 'Section A: Mathematics Core',
        points: 40,
        questions: ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10']
      },
      {
        id: 'sec-stem-phys',
        title: 'Section B: Physics Core',
        points: 40,
        questions: ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10']
      },
      {
        id: 'sec-stem-cs',
        title: 'Section C: Computer Science Core',
        points: 40,
        questions: ['cs01', 'cs02', 'cs03', 'cs04', 'cs05', 'cs06', 'cs07', 'cs08', 'cs09', 'cs10']
      }
    ]
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-001',
    studentName: 'Alex Mercer',
    studentId: 'STU-2026-001',
    examId: 'exam-stem-s2',
    submittedAt: '2026-09-20T14:30:00Z',
    status: 'Graded',
    answers: {
      'm01': 1,
      'm02': 0,
      'm03': '0.167',
      'm04': 0,
      'p01': '90',
      'p02': '30',
      'p03': 0,
      'cs01': 0,
      'cs02': 0,
      'cs06': '180'
    },
    scores: {
      'm01': 4,
      'm02': 4,
      'm03': 4,
      'm04': 4,
      'p01': 4,
      'p02': 4,
      'p03': 4,
      'cs01': 4,
      'cs02': 4,
      'cs06': 4
    },
    totalScore: 40,
    maxScore: 40,
    percentage: 100,
    feedback: 'Flawless performance across all objective questions and numeric inputs.'
  },
  {
    id: 'sub-002',
    studentName: 'Elena Rostova',
    studentId: 'STU-2026-002',
    examId: 'exam-math-mastery',
    submittedAt: '2026-09-21T09:15:00Z',
    status: 'Pending',
    answers: {
      'm01': 1,
      'm02': 0,
      'm03': '0.167',
      'm04': 0,
      'm05': 0,
      'm06': 2,
      'm07': '3',
      'm08': 1,
      'm09': 0,
      'm10': 0
    },
    scores: {},
    totalScore: 0,
    maxScore: 160,
    percentage: 0,
    feedback: ''
  },
  {
    id: 'sub-003',
    studentName: 'Marcus Vance',
    studentId: 'STU-2026-003',
    examId: 'exam-physics-mastery',
    submittedAt: '2026-09-21T10:45:00Z',
    status: 'Pending',
    answers: {
      'p01': '90',
      'p02': '30',
      'p03': 0,
      'p04': '60',
      'p05': 0,
      'p06': '20'
    },
    scores: {},
    totalScore: 0,
    maxScore: 160,
    percentage: 0,
    feedback: ''
  }
];
