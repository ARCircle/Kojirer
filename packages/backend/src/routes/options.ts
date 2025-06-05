import { typedAsyncWrapper } from '@/utils/wrappers';
import express from 'express';
import prisma from '@/lib/prismaClient';

const router = express.Router();

router.get('/', typedAsyncWrapper<"/options", "get">(async (req, res) => {
  const options = await prisma.options.findMany();

  res.send(options);
}));

export default router;