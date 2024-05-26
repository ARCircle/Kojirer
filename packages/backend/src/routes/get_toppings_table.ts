import express from 'express';
import prisma from '@/lib/prismaClient.js';

const router = express.Router();

//get available only
router.get('/koujirer/toppingList/available', async (req, res, next) => {
  try {
    const topping_table = await prisma.toppings.findMany({
      //get available: true
      where: {
        available: true,
      },
      //get id and label
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

//get all
router.get('/koujirer/toppingList/all', async (req, res, next) => {
  try {
    const topping_table = await prisma.toppings.findMany({
      //get id and label
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