import { describe, it, expect } from 'vitest';
import { evaluateAnswer, gradeExamSubmission, calculateGradeBadge } from '../utils/gradingEngine';

describe('Grading Engine - Single Answer Evaluation', () => {
  it('grades correct multiple-choice response', () => {
    const q = { id: 'q1', type: 'multiple-choice', correctAnswer: 2, points: 4 };
    const res = evaluateAnswer(q, 2);
    expect(res.isCorrect).toBe(true);
    expect(res.score).toBe(4);
  });

  it('grades incorrect multiple-choice response with 0 marks', () => {
    const q = { id: 'q1', type: 'multiple-choice', correctAnswer: 2, points: 4 };
    const res = evaluateAnswer(q, 0);
    expect(res.isCorrect).toBe(false);
    expect(res.score).toBe(0);
  });

  it('grades numeric answer within tolerance bounds', () => {
    const q = { id: 'q2', type: 'numeric', correctAnswer: 11.0, tolerance: 0.1, points: 5 };
    const res = evaluateAnswer(q, '11.05');
    expect(res.isCorrect).toBe(true);
    expect(res.score).toBe(5);
  });

  it('marks numeric answer outside tolerance as incorrect', () => {
    const q = { id: 'q2', type: 'numeric', correctAnswer: 11.0, tolerance: 0.1, points: 5 };
    const res = evaluateAnswer(q, '11.2');
    expect(res.isCorrect).toBe(false);
    expect(res.score).toBe(0);
  });

  it('flags free response as requiring manual review', () => {
    const q = { id: 'q3', type: 'free-response', points: 6 };
    const res = evaluateAnswer(q, 'Let x be...');
    expect(res.requiresManualReview).toBe(true);
    expect(res.score).toBe(0);
  });
});

describe('Grading Engine - Exam Batch Grading', () => {
  const mockQuestions = [
    { id: 'm1', type: 'multiple-choice', correctAnswer: 1, points: 4 },
    { id: 'm2', type: 'numeric', correctAnswer: 25.0, tolerance: 0.05, points: 4 },
    { id: 'm3', type: 'free-response', points: 8 }
  ];

  it('computes auto-scores correctly across sections', () => {
    const userAnswers = {
      m1: 1,
      m2: '25.02',
      m3: 'Step 1: derivation'
    };

    const result = gradeExamSubmission(mockQuestions, userAnswers);
    expect(result.autoScore).toBe(8); // 4 + 4
    expect(result.maxAutoScore).toBe(8);
    expect(result.totalMaxScore).toBe(16);
    expect(result.answeredCount).toBe(3);
    expect(result.percentage).toBe(50); // 8/16
  });
});

describe('Grading Engine - Letter Grade Badges', () => {
  it('maps standard percentage scale to grade boundaries', () => {
    expect(calculateGradeBadge(95).grade).toBe('A*');
    expect(calculateGradeBadge(82).grade).toBe('A');
    expect(calculateGradeBadge(74).grade).toBe('B');
    expect(calculateGradeBadge(65).grade).toBe('C');
    expect(calculateGradeBadge(45).grade).toBe('F');
  });
});
