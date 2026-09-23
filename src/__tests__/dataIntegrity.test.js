import { describe, it, expect } from 'vitest';
import { EXAMS } from '../data/examData';
import { QUESTION_BANK } from '../data/questionBank';
import { CURRICULUM, SUBJECTS } from '../data/curriculumData';
import { SLIDE_DECKS } from '../data/slideDecks';

describe('Data Integrity - Assessment & Question Bank Cross-References', () => {
  const allQuestionIds = new Set(QUESTION_BANK.map((q) => q.id));

  it('verifies every question ID referenced in exam sections exists in QUESTION_BANK', () => {
    EXAMS.forEach((exam) => {
      exam.sections.forEach((sec) => {
        sec.questions.forEach((qId) => {
          expect(
            allQuestionIds.has(qId),
            `Exam "${exam.id}" section "${sec.id}" references missing question ID: "${qId}"`
          ).toBe(true);
        });
      });
    });
  });

  it('validates question schemas for all questions in bank', () => {
    QUESTION_BANK.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.subject).toMatch(/^(math|physics|cs)$/);
      expect(q.type).toMatch(/^(multiple-choice|numeric|free-response)$/);
      expect(typeof q.prompt).toBe('string');

      if (q.type === 'multiple-choice') {
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(typeof q.correctAnswer).toBe('number');
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThan(q.options.length);
      } else if (q.type === 'numeric') {
        expect(typeof q.correctAnswer).toBe('number');
        expect(isNaN(q.correctAnswer)).toBe(false);
        // Ensure textbook LaTeX formulas and step-by-step derivations exist for numeric problems
        expect(typeof q.formula).toBe('string');
        expect(q.formula.trim().length).toBeGreaterThan(0);
        expect(typeof q.solution).toBe('string');
        expect(q.solution.trim().length).toBeGreaterThan(0);
      } else if (q.type === 'free-response') {
        expect(q.points).toBeGreaterThan(0);
      }
    });
  });
});

describe('Data Integrity - Curriculum & Slide Decks', () => {
  it('ensures all subjects in SUBJECTS exist in CURRICULUM', () => {
    SUBJECTS.forEach((sub) => {
      expect(CURRICULUM[sub.id]).toBeDefined();
      expect(CURRICULUM[sub.id].length).toBeGreaterThan(0);
    });
  });

  it('ensures all slide decks contain non-empty slide arrays', () => {
    Object.entries(SLIDE_DECKS).forEach(([deckId, deck]) => {
      expect(deck.title).toBeDefined();
      expect(Array.isArray(deck.slides)).toBe(true);
      expect(deck.slides.length).toBeGreaterThan(0);
    });
  });
});
