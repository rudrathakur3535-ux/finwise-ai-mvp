import assert from 'assert';
import { calculateNextDifficulty, updateMasteryScore } from '../src/services/adaptiveEngine';

console.log('--- Testing Adaptive Difficulty Engine ---');

// Scenario 1: Fast + Correct
// A student on difficulty 1 answers correctly in 5 seconds (5000ms)
// Expectation: Jump to difficulty 2
{
  const nextDiff = calculateNextDifficulty(1, true, 5000);
  assert.strictEqual(nextDiff, 2, 'Failed: Fast+Correct should jump difficulty');
  console.log('✅ Fast + Correct test passed');
}

// Scenario 2: Slow + Correct
// A student on difficulty 2 answers correctly in 15 seconds (15000ms)
// Expectation: Stay at difficulty 2
{
  const nextDiff = calculateNextDifficulty(2, true, 15000);
  assert.strictEqual(nextDiff, 2, 'Failed: Slow+Correct should stay same difficulty');
  console.log('✅ Slow + Correct test passed');
}

// Scenario 3: Fast + Incorrect
// A student on difficulty 3 answers incorrectly in 4 seconds (4000ms)
// Expectation: Drop to difficulty 2
{
  const nextDiff = calculateNextDifficulty(3, false, 4000);
  assert.strictEqual(nextDiff, 2, 'Failed: Fast+Incorrect should drop difficulty');
  console.log('✅ Fast + Incorrect test passed');
}

// Scenario 4: Slow + Incorrect
// A student on difficulty 2 answers incorrectly in 20 seconds (20000ms)
// Expectation: Drop to difficulty 1
{
  const nextDiff = calculateNextDifficulty(2, false, 20000);
  assert.strictEqual(nextDiff, 1, 'Failed: Slow+Incorrect should drop difficulty');
  console.log('✅ Slow + Incorrect test passed');
}

console.log('\n--- Testing Mastery Score Updates ---');
{
  // Start with 50 score
  let score = 50;
  
  // Correct on Level 1 (+5) -> 55
  score = updateMasteryScore(score, 1, true);
  assert.strictEqual(score, 55, 'Mastery correct L1 failed');
  
  // Incorrect on Level 1 (-15) -> 40
  score = updateMasteryScore(score, 1, false);
  assert.strictEqual(score, 40, 'Mastery incorrect L1 failed');
  
  // Correct on Level 3 (+15) -> 55
  score = updateMasteryScore(score, 3, true);
  assert.strictEqual(score, 55, 'Mastery correct L3 failed');
  
  console.log('✅ Mastery score update tests passed');
}

console.log('\nAll adaptive engine tests passed successfully!');
