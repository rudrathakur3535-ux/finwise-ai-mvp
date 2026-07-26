import { Router } from 'express';
import prisma from '../db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const subjects = await prisma.subject.findMany({
    include: { topics: true }
  });
  res.json(subjects);
});

router.get('/:id/topics', authenticate, async (req, res) => {
  const { id } = req.params;
  const topics = await prisma.topic.findMany({
    where: { subjectId: Number(id) }
  });
  res.json(topics);
});

export default router;
