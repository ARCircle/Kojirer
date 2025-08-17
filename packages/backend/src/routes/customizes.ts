import express, { Router } from 'express';
import prisma from '@/lib/prismaClient';
import { typedAsyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';

const router: Router = express.Router();

//get all
router.get(
  '/',
  typedAsyncWrapper<'/customizes', 'get'>(async (req, res, next) => {
    const toppings = await prisma.customizes.findMany({
      //include topping_prices table
      include: {
        customize_prices: {
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
      const { customize_prices, ...sendTopping } = t;

      return {
        ...sendTopping,
        price: customize_prices[0].price,
      };
    });

    res.status(200).send(sendToppings);
  }),
);

export default router;
