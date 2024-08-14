import express from 'express';
import prisma from '@/lib/prismaClient';

const router = express.Router();

//get available only
router.get('/available', async (req, res, next) => {
  try {
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
          take: 1
        }
      }
    });

    if (!toppings) {
      next();
      return;
    }

    const sendToppings = toppings.map(t => {
      const { available, topping_prices, ...sendTopping } = t

      return {
        ...sendTopping,
        price: topping_prices[0].price
      }
    })

    res.status(200).send(sendToppings);

  } catch(e) {
    next();
    console.error(e);
  }
});

//get all
router.get('/all', async (req, res, next) => {
  try {
    const toppings = await prisma.toppings.findMany({

      //include topping_prices table
      include: {
        topping_prices: {
          select: {
            price: true,
          },
          orderBy: { since: 'desc' },
          take: 1
        }
      },
    });

    if (!toppings) {
      next();
      return;
    }

    const sendToppings = toppings.map(t => {
      const { available, topping_prices, ...sendTopping } = t

      return {
        ...sendTopping,
        price: topping_prices[0].price
      }
    })

    res.status(200).send(sendToppings);

  } catch(e) {
    next();
    console.error(e);
  }
});

export default router;