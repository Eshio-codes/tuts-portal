export const EXAMS = [
  {
    id: 'exam-stem-s2',
    title: 'Sprint Assessment: Session 2 STEM Comprehensive Exam',
    subject: 'combined',
    timeLimitMinutes: 60,
    totalPoints: 50,
    description: 'Timed assessment covering Physics DC Circuits & Dividers, CS IEEE 754 & Bitwise Logic, and Math Limit Laws.',
    instructions: 'Answer all 6 questions. For numerical questions, provide answers with appropriate precision. For free-response questions, show all intermediate steps and derivations.',
    sections: [
      {
        id: 'sec-math',
        title: 'Section A: Mathematics (Limits & Continuity)',
        points: 16,
        questions: ['m1-01', 'm1-02', 'm1-03']
      },
      {
        id: 'sec-physics',
        title: 'Section B: Physics (DC Circuits & Internal Resistance)',
        points: 17,
        questions: ['p2-01', 'p2-02', 'p2-03']
      },
      {
        id: 'sec-cs',
        title: 'Section C: Computer Science (Float Encoding & Bitwise Logic)',
        points: 17,
        questions: ['cs2-01', 'cs2-02', 'cs2-03']
      }
    ]
  },
  {
    id: 'exam-physics-unit1',
    title: 'Physics Unit 1 Mastery Exam: Kinematics & Circuits',
    subject: 'physics',
    timeLimitMinutes: 45,
    totalPoints: 30,
    description: 'Focused test on 1D/2D Kinematics and DC Circuit analysis with Kirchhoff’s Laws.',
    instructions: 'Calculators permitted. State units in all numeric answers.',
    sections: [
      {
        id: 'sec-phys-all',
        title: 'Physics Circuit Mastery',
        points: 30,
        questions: ['p2-01', 'p2-02', 'p2-03']
      }
    ]
  },
  {
    id: 'exam-cs-unit1',
    title: 'CS Unit 1 Mastery Exam: Hardware & Data Representation',
    subject: 'cs',
    timeLimitMinutes: 45,
    totalPoints: 30,
    description: 'Hardware architecture, Von Neumann CPU cycle, 2’s complement arithmetic, and IEEE 754 floating-point standard.',
    instructions: 'Binary arithmetic and bitwise derivations required.',
    sections: [
      {
        id: 'sec-cs-all',
        title: 'Computer Systems & Number Formats',
        points: 30,
        questions: ['cs2-01', 'cs2-02', 'cs2-03']
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
    status: 'Graded', // 'Pending' | 'Graded'
    answers: {
      'm1-01': 1,
      'm1-02': '0.167',
      'm1-03': 'Continuity at x=2 requires 2a+3 = 5 => a=1. Also 2(2)^2 + b = 8+b = 5 => b = -3.',
      'p2-01': 1,
      'p2-02': '11.0',
      'p2-03': 'Part A: I = Vin / (R1+R2), Vout = I*R2 = 30 * (200/300) = 20V. Part C: 200 || 200 = 100 ohms. Vout_loaded = 30 * (100 / 200) = 15V.',
      'cs2-01': 0,
      'cs2-02': '80',
      'cs2-03': '13.625 = 1101.101_2 = 1.101101 * 2^3. Sign=1, Biased Exponent=3+127=130 (10000010), Mantissa=10110100000000000000000. Hex: 0xC15A0000.'
    },
    scores: {
      'm1-01': 4,
      'm1-02': 4,
      'm1-03': 8,
      'p2-01': 3,
      'p2-02': 4,
      'p2-03': 10,
      'cs2-01': 3,
      'cs2-02': 4,
      'cs2-03': 10
    },
    totalScore: 50,
    maxScore: 50,
    percentage: 100,
    feedback: 'Outstanding performance across all three subjects! Full marks on IEEE 754 manual encoding and circuit loading derivation.'
  }
];
