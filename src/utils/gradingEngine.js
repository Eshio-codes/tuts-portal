/**
 * Assessment Auto-Grading and Evaluation Engine
 * Pure logic for validating student candidate answers and calculating rubric scores
 */

/**
 * Validates a single question answer
 * @param {object} question - Question definition object
 * @param {any} userAnswer - Student answer (index for MCQ, string/number for numeric, string for free response)
 * @returns {object} { isCorrect, score, maxScore }
 */
export function evaluateAnswer(question, userAnswer) {
  const maxScore = question.points || 4;

  if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
    return { isCorrect: false, score: 0, maxScore, unattempted: true };
  }

  if (question.type === 'multiple-choice') {
    const isCorrect = userAnswer === question.correctAnswer;
    return { isCorrect, score: isCorrect ? maxScore : 0, maxScore };
  }

  if (question.type === 'numeric') {
    const num = parseFloat(userAnswer);
    const tolerance = question.tolerance !== undefined ? question.tolerance : 0.01;
    const isCorrect = !isNaN(num) && Math.abs(num - question.correctAnswer) <= tolerance;
    return { isCorrect, score: isCorrect ? maxScore : 0, maxScore };
  }

  // Free response requires manual grading
  return { isCorrect: null, score: 0, maxScore, requiresManualReview: true };
}

/**
 * Calculates total auto-score for a list of exam questions
 * @param {Array} examQuestions - Array of question objects
 * @param {object} answers - Map of { questionId: answer }
 * @returns {object} { autoScore, maxAutoScore, scoresMap, totalQuestions, answeredCount }
 */
export function gradeExamSubmission(examQuestions, answers = {}) {
  let autoScore = 0;
  let maxAutoScore = 0;
  let totalMaxScore = 0;
  let answeredCount = 0;
  const scoresMap = {};

  examQuestions.forEach((q) => {
    const userAns = answers[q.id];
    const qMax = q.points || 4;
    totalMaxScore += qMax;

    if (userAns !== undefined && userAns !== null && userAns !== '') {
      answeredCount++;
    }

    const evaluation = evaluateAnswer(q, userAns);
    scoresMap[q.id] = evaluation.score;

    if (q.type === 'multiple-choice' || q.type === 'numeric') {
      maxAutoScore += qMax;
      autoScore += evaluation.score;
    }
  });

  return {
    autoScore,
    maxAutoScore,
    totalMaxScore,
    scoresMap,
    totalQuestions: examQuestions.length,
    answeredCount,
    percentage: totalMaxScore > 0 ? Math.round((autoScore / totalMaxScore) * 100) : 0,
    autoPercentage: maxAutoScore > 0 ? Math.round((autoScore / maxAutoScore) * 100) : 0
  };
}

/**
 * Calculates letter grade and visual badge styling for a given percentage
 * @param {number} percentage
 * @returns {object} { grade, style }
 */
export function calculateGradeBadge(percentage) {
  const pct = Math.round(percentage);
  if (pct >= 90) return { grade: 'A*', label: 'Distinction', style: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' };
  if (pct >= 80) return { grade: 'A', label: 'Excellent', style: 'text-zinc-200 bg-zinc-800 border-zinc-700' };
  if (pct >= 70) return { grade: 'B', label: 'Good', style: 'text-zinc-300 bg-zinc-850 border-zinc-750' };
  if (pct >= 60) return { grade: 'C', label: 'Pass', style: 'text-amber-400 bg-amber-950/40 border-amber-800/40' };
  return { grade: 'F', label: 'Unclassified', style: 'text-rose-400 bg-rose-950/40 border-rose-800/40' };
}
