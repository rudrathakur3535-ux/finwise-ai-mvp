import { Router } from 'express';
import prisma from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const students = await prisma.user.findMany({
    include: {
      masteries: { include: { topic: true } },
      attempts: true
    }
  });

  const leaderboard = students.map(student => {
    const completedQuizzes = student.attempts.filter(a => a.endTime !== null).length;
    let avgScore = 0;
    let bestTopic = null;
    let maxMastery = -1;

    if (student.masteries.length > 0) {
      const totalMastery = student.masteries.reduce((sum, m) => sum + m.score, 0);
      avgScore = totalMastery / student.masteries.length;

      for (const m of student.masteries) {
        if (m.score > maxMastery) {
          maxMastery = m.score;
          bestTopic = m.topic.name;
        }
      }
    }

    return {
      username: student.username,
      averageScore: avgScore,
      quizzesCompleted: completedQuizzes,
      bestTopic
    };
  }).sort((a, b) => b.averageScore - a.averageScore).slice(0, 10);

  res.json({ leaderboard });
});

export default router;
