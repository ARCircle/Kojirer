import express from 'express';
import prisma from '@/lib/prismaClient';
import { asyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';

const router = express.Router();

//get available only
router.get(
  '/available',
  asyncWrapper(async (req, res, next) => {
    const toppings = await prisma.toppings.findMany({
      //get available: true
      where: {
        available: true,
      },

      //include topping_prices table
      include: {
        topping_prices: {
          select: {
            price: true,
          },
          orderBy: { since: 'desc' },
          take: 1,
        },
      },
    });

    if (!toppings) {
      throw ApiError.internalProblems();
    }

    const sendToppings = toppings.map((t) => {
      const { available, topping_prices, ...sendTopping } = t;

      return {
        ...sendTopping,
        price: topping_prices[0].price,
      };
    });

    res.status(200).send(sendToppings);
  }),
);

//get all
router.get(
  '/',
  asyncWrapper(async (req, res, next) => {
    const toppings = await prisma.toppings.findMany({
      //include topping_prices table
      include: {
        topping_prices: {
          select: {
            price: true,
          },
          orderBy: { since: 'desc' },
          take: 1,
        },
      },
    });

    if (!toppings) {
      throw ApiError.internalProblems();
    }

    const sendToppings = toppings.map((t) => {
      const { available, topping_prices, ...sendTopping } = t;

      return {
        ...sendTopping,
        price: topping_prices[0].price,
      };
    });

    res.status(200).send(sendToppings);
  }),
);

export default router;
