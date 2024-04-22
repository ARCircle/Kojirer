import express, { Request } from 'express';
import prisma from '@/lib/prismaClient.js';

interface Topping {
  id: number,
  amount: number,
}

interface PriceBody {
  size: number,
  toppings: Topping[] | undefined,
}

interface RequestBody {
  isOnlyAvailable: boolean,
}

const router = express.Router();

router.get('/price', async (req: Request<any, any, RequestBody>, res, next) => {
  const isOnlyAvailabe = req.body.isOnlyAvailable;

  if (isOnlyAvailabe) {
    try {
      const topping_table = await prisma.toppings.findMany({
        where: {
          available: true,
        },
        select: {
          id: true,
          label: true
        }
      })

      if (!topping_table) {
        next();
        return;
      }

      res.status(200).send({ topping_table });

    } catch(e) {
      next();
      console.error(e);
    }

  } else {
    try {
      const topping_table = await prisma.toppings.findMany({
        select: {
          id: true,
          label: true
        }
      })

      if (!topping_table) {
        next();
        return;
      }

      res.status(200).send({ topping_table });

    } catch(e) {
      next();
      console.error(e);
    }
  }
});

export default router;