import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, async (req: AuthRequest, res: any) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attempts: {
        include: {
          questions: true
        },
        orderBy: {
          startTime: 'desc'
        }
      },
      masteries: {
        include: {
          topic: true
        }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  let totalScore = 0;
  let completedQuizzes = 0;
  
  user.attempts.forEach(a => {
    if (a.endTime !== null && a.score !== null) {
      totalScore += a.score;
      completedQuizzes++;
    }
  });
  const avgScore = completedQuizzes > 0 ? totalScore / completedQuizzes : 0;

  let bestTopic = null;
  let maxMastery = -1;
  for (const m of user.masteries) {
    if (m.score > maxMastery) {
      maxMastery = m.score;
      bestTopic = m.topic.name;
    }
  }

  let totalQuestionsAnswered = 0;
  let correctQuestions = 0;

  user.attempts.forEach(a => {
    a.questions.forEach(q => {
      totalQuestionsAnswered++;
      if (q.isCorrect) correctQuestions++;
    });
  });

  const accuracy = totalQuestionsAnswered > 0 ? (correctQuestions / totalQuestionsAnswered) * 100 : 0;

  let streak = 0;
  if (user.attempts.length > 0) {
    const dates = user.attempts.map(a => {
      const d = new Date(a.startTime);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let currentDateTime = currentDate.getTime();

    let checkTime = currentDateTime;
    if (uniqueDates.length > 0 && uniqueDates[0] === currentDateTime) {
      // today
    } else if (uniqueDates.length > 0 && uniqueDates[0] === currentDateTime - 86400000) {
      checkTime = currentDateTime - 86400000; // yesterday
    }

    for (const time of uniqueDates) {
      if (time === checkTime) {
        streak++;
        checkTime -= 86400000;
      } else if (time < checkTime) {
        break;
      }
    }
  }

  res.json({
    totalQuizzes: completedQuizzes,
    averageScore: avgScore,
    currentStreak: streak,
    bestTopic: bestTopic,
    totalQuestionsAnswered: totalQuestionsAnswered,
    accuracyPercentage: accuracy
  });
});

export default router;
