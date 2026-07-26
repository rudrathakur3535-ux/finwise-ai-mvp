import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateNextDifficulty, updateMasteryScore } from '../services/adaptiveEngine';

const router = Router();

router.post('/start', authenticate, async (req: AuthRequest, res: any) => {
  const { topicId } = req.body;
  const userId = req.user!.id;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      topicId: Number(topicId)
    }
  });

  const pastAttempts = await prisma.questionAttempt.findMany({
    where: {
      quizAttempt: {
        userId,
        topicId: Number(topicId)
      }
    },
    select: { questionId: true }
  });
  const pastQuestionIds = pastAttempts.map(a => a.questionId);

  const mastery = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId: Number(topicId) } }
  });
  
  let startingDifficulty = 1;
  if (mastery) {
    if (mastery.score > 80) startingDifficulty = 3;
    else if (mastery.score > 60) startingDifficulty = 2;
  }

  const question = await prisma.question.findFirst({
    where: { 
      topicId: Number(topicId), 
      difficultyLevel: startingDifficulty,
      id: { notIn: pastQuestionIds }
    }
  });

  let finalQuestion = question;
  if (!finalQuestion) {
    finalQuestion = await prisma.question.findFirst({
      where: {
        topicId: Number(topicId),
        id: { notIn: pastQuestionIds }
      }
    });
  }

  if (!finalQuestion) {
    finalQuestion = await prisma.question.findFirst({
      where: {
        topicId: Number(topicId)
      }
    });
  }

  return res.json({ quizAttemptId: attempt.id, question: finalQuestion });
});

router.post('/next-question', authenticate, async (req: AuthRequest, res: any) => {
  const { quizAttemptId, questionId, isCorrect, timeTakenMs, selectedOptionIndex } = req.body;
  const userId = req.user!.id;

  await prisma.questionAttempt.create({
    data: {
      quizAttemptId: Number(quizAttemptId),
      questionId: Number(questionId),
      isCorrect,
      timeTakenMs: Number(timeTakenMs),
      selectedOptionIndex: selectedOptionIndex !== undefined && selectedOptionIndex !== null ? Number(selectedOptionIndex) : null
    }
  });

  const currentQuestion = await prisma.question.findUnique({
    where: { id: Number(questionId) }
  });

  if (!currentQuestion) return res.status(404).json({ error: 'Question not found' });

  // Use the adaptive engine to calculate next difficulty
  const nextDifficulty = calculateNextDifficulty(
    currentQuestion.difficultyLevel,
    isCorrect,
    Number(timeTakenMs)
  );

  // Update Mastery Score in DB
  let mastery = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId: currentQuestion.topicId } }
  });

  if (!mastery) {
    mastery = await prisma.topicMastery.create({
      data: { userId, topicId: currentQuestion.topicId, score: 0 }
    });
  }

  const newScore = updateMasteryScore(mastery.score, currentQuestion.difficultyLevel, isCorrect);

  await prisma.topicMastery.update({
    where: { id: mastery.id },
    data: { score: newScore }
  });

  const pastAttempts = await prisma.questionAttempt.findMany({
    where: {
      quizAttempt: {
        userId,
        topicId: currentQuestion.topicId
      }
    },
    select: { questionId: true }
  });
  
  const pastQuestionIds = pastAttempts.map(a => a.questionId);

  let nextQuestion = await prisma.question.findFirst({
    where: {
      topicId: currentQuestion.topicId,
      difficultyLevel: nextDifficulty,
      id: { notIn: pastQuestionIds }
    }
  });

  if (!nextQuestion) {
    nextQuestion = await prisma.question.findFirst({
      where: {
        topicId: currentQuestion.topicId,
        id: { notIn: pastQuestionIds }
      }
    });
  }

  if (!nextQuestion) {
    return res.json({ finished: true, currentMasteryScore: newScore });
  }

  return res.json({ finished: false, question: nextQuestion, currentMasteryScore: newScore });
});

router.post('/submit', authenticate, async (req: AuthRequest, res: any) => {
  const { quizAttemptId } = req.body;

  const attempts = await prisma.questionAttempt.findMany({
    where: { quizAttemptId: Number(quizAttemptId) }
  });

  const correctCount = attempts.filter(a => a.isCorrect).length;
  const score = Math.round((correctCount / Math.max(attempts.length, 1)) * 100);

  await prisma.quizAttempt.update({
    where: { id: Number(quizAttemptId) },
    data: {
      endTime: new Date(),
      score
    }
  });

  return res.json({ score, correctCount, total: attempts.length });
});

// New Endpoint: Get mastery score for a specific topic
router.get('/mastery/:topicId', authenticate, async (req: AuthRequest, res: any) => {
  const userId = req.user!.id;
  const { topicId } = req.params;

  const mastery = await prisma.topicMastery.findUnique({
    where: { userId_topicId: { userId, topicId: Number(topicId) } }
  });

  return res.json({ score: mastery ? mastery.score : 0 });
});

// Endpoint: Get quiz review
router.get('/review/:quizAttemptId', authenticate, async (req: AuthRequest, res: any) => {
  const { quizAttemptId } = req.params;
  const userId = req.user!.id;

  const quizAttempt = await prisma.quizAttempt.findUnique({
    where: { id: Number(quizAttemptId) },
    include: {
      topic: true,
      questions: {
        include: {
          question: true
        }
      }
    }
  });

  if (!quizAttempt || quizAttempt.userId !== userId) {
    return res.status(404).json({ error: 'Quiz attempt not found' });
  }

  const answers = quizAttempt.questions.map(qa => ({
    id: qa.id,
    isCorrect: qa.isCorrect,
    timeTakenMs: qa.timeTakenMs,
    selectedOptionIndex: qa.selectedOptionIndex !== null && qa.selectedOptionIndex !== undefined
      ? qa.selectedOptionIndex
      : (qa.isCorrect ? qa.question.correctOption : -1),
    question: qa.question
  }));

  return res.json({
    id: quizAttempt.id,
    score: quizAttempt.score ?? 0,
    topic: quizAttempt.topic || { name: 'Quiz Topic' },
    answers
  });
});

export default router;
