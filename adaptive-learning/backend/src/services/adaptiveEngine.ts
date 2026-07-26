/**
 * Adaptive Difficulty Engine
 * 
 * This engine calculates the next appropriate difficulty level for a student based 
 * on their performance on the current question. It uses a rule-based logic that factors 
 * in BOTH accuracy (whether the answer was correct) AND response time (pace).
 * 
 * Rules:
 * 1. Fast & Correct: The student understands the topic well. Jump difficulty aggressively (+1).
 * 2. Slow & Correct: The student got it right but took time. Keep the difficulty the same to build confidence (0).
 * 3. Fast & Incorrect: The student might be guessing or making careless mistakes. Drop difficulty (-1).
 * 4. Slow & Incorrect: The student is struggling with the concept. Drop difficulty (-1).
 * 
 * Constraints: Difficulty is bounded between 1 and 3.
 */

export function calculateNextDifficulty(
  currentDifficulty: number, 
  isCorrect: boolean, 
  timeTakenMs: number
): number {
  const FAST_THRESHOLD_MS = 10000; // 10 seconds is considered "fast"
  let nextDifficulty = currentDifficulty;

  if (isCorrect) {
    if (timeTakenMs < FAST_THRESHOLD_MS) {
      // Fast and correct
      nextDifficulty = currentDifficulty + 1;
    } else {
      // Slow and correct
      nextDifficulty = currentDifficulty;
    }
  } else {
    // Incorrect (whether fast or slow) always drops difficulty
    nextDifficulty = currentDifficulty - 1;
  }

  // Ensure difficulty stays within bounds 1 to 3
  return Math.max(1, Math.min(3, nextDifficulty));
}

/**
 * Updates a student's mastery score (0-100) for a topic after answering a question.
 * A correct answer at higher difficulties yields more points.
 * An incorrect answer at lower difficulties costs more points.
 */
export function updateMasteryScore(
  currentScore: number,
  currentDifficulty: number,
  isCorrect: boolean
): number {
  let change = 0;
  
  if (isCorrect) {
    // Earn more points for getting hard questions right
    // Level 1: +5, Level 2: +10, Level 3: +15
    change = 5 * currentDifficulty; 
  } else {
    // Lose more points for getting easy questions wrong
    // Level 1: -15, Level 2: -10, Level 3: -5
    change = -5 * (4 - currentDifficulty);
  }

  const newScore = currentScore + change;
  
  // Bound score between 0 and 100
  return Math.max(0, Math.min(100, newScore));
}
