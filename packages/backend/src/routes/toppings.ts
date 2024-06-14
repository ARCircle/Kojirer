import express from 'express';
import prisma from '@/lib/prismaClient.js';

const router = express.Router();

//get available only
router.get('/available', async (req, res, next) => {
  try {
    const toppingTable = await prisma.toppings.findMany({
      
      //get available: true
      where: {
        available: true,
      },

      //include topping_prices table
      include: {
        topping_prices: {
          select: {
            price: true
          }
        }
      },
      //get id and label
      select: {
        id: true,
        label: true
      }
    });

    if (!toppingTable) {
      next();
      return;
    }

    res.status(200).send({ toppingTable });

  } catch(e) {
    next();
    console.error(e);
  }
});

//get all
router.get('/all', async (req, res, next) => {
  try {
    const toppingTable = await prisma.toppings.findMany({

      //include topping_prices table
      include: {
        topping_price: {
          select: {
            price: true
          }
        }
      },

      //get id and label
      select: {
        id: true,
        label: true
      }
    });

    if (!toppingTable) {
      next();
      return;
    }

    res.status(200).send({ toppingTable });

  } catch(e) {
    next();
    console.error(e);
  }
});

export default router;