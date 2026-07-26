import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/student', authenticate, async (req: AuthRequest, res: any) => {
  const userId = req.user!.id;
  if (req.user!.role !== 'STUDENT') return res.status(403).json({ error: 'Not a student' });

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: { topic: { include: { subject: true } } },
    orderBy: { startTime: 'desc' }
  });

  const mastery: Record<string, { totalScore: number; count: number; name: string }> = {};
  attempts.forEach(a => {
    if (a.score !== null) {
      if (!mastery[a.topicId]) {
        mastery[a.topicId] = { totalScore: 0, count: 0, name: a.topic.name };
      }
      mastery[a.topicId].totalScore += a.score;
      mastery[a.topicId].count += 1;
    }
  });

  const topicMastery = Object.values(mastery).map(m => ({
    name: m.name,
    averageScore: Math.round(m.totalScore / m.count)
  }));

  return res.json({ recentAttempts: attempts.slice(0, 5), topicMastery });
});

router.get('/teacher', authenticate, async (req: AuthRequest, res: any) => {
  if (req.user!.role !== 'TEACHER') return res.status(403).json({ error: 'Not a teacher' });

  const allAttempts = await prisma.quizAttempt.findMany({
    where: { score: { not: null } },
    include: { topic: true, user: { select: { username: true } } },
    orderBy: { startTime: 'desc' }
  });

  const classMastery: Record<string, { totalScore: number; count: number; name: string }> = {};
  allAttempts.forEach(a => {
    if (a.score !== null) {
      if (!classMastery[a.topicId]) {
        classMastery[a.topicId] = { totalScore: 0, count: 0, name: a.topic.name };
      }
      classMastery[a.topicId].totalScore += a.score;
      classMastery[a.topicId].count += 1;
    }
  });

  const classAverages = Object.values(classMastery).map(m => ({
    topicName: m.name,
    averageScore: Math.round(m.totalScore / m.count)
  }));

  return res.json({ classAverages, recentActivity: allAttempts.slice(0, 10) });
});

export default router;
