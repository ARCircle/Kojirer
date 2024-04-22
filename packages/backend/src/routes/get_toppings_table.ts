import express from 'express';
import prisma from '@/lib/prismaClient.js';

const router = express.Router();

router.get('/koujirer/toppingList/available', async (req, res, next) => {
  try {
    const topping_table = await prisma.toppings.findMany({
      where: {
        available: true,
      },
      select: {
        id: true,
        label: true
      }
    });

    if (!topping_table) {
      next();
      return;
    }

    res.status(200).send({ topping_table });

  } catch(e) {
    next();
    console.error(e);
  }
});

router.get('/koujirer/toppingList/all', async (req, res, next) => {
  try {
    const topping_table = await prisma.toppings.findMany({
      select: {
        id: true,
        label: true
      }
    });
     if (!topping_table) {
      next();
      return;
    }

    res.status(200).send({ topping_table });

  } catch(e) {
    next();
    console.error(e);
  }
});

export default router;