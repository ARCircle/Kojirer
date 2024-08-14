import express, { Request } from 'express';
import prisma from '@/lib/prismaClient';
import { asyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';

interface Topping {
  id: number,
  amount: number,
}

interface PriceBody {
  size: number,
  toppings: Topping[] | undefined,
  isFollowed: boolean,
}

const router = express.Router();

router.post('/price', asyncWrapper(async (req: Request<any, any, PriceBody>, res, next) => {
  const reqSize = req.body.size;
  const reqToppings = req.body.toppings || [];
  const isFollowed = !!req.body.isFollowed;

  if (!reqSize) {
    throw ApiError.invalidParams();
  }

  const size = await prisma.sizes.findFirst({ 
    where: { 
      id: reqSize,
    }, 
    include: { 
      size_prices: {
        select: {
          price: true
        },
        orderBy: { since: 'desc' },
      }
    }
  });

  const toppingsPrices = await prisma.toppings.findMany({
    where: {
      id: {
        in: reqToppings?.map(t => t.id),
      },
    },
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

  if (!size) {
    throw ApiError.internalProblems();
  }

  const donPrice = size.size_prices[0].price;
  const toppingsPrice = toppingsPrices.reduce((sum, topping) => {
    const amount = reqToppings.filter(t => t.id == topping.id)[0].amount;
    const price = topping.topping_prices[0].price;

    return sum + price * amount;
  }, 0);

  const discount = isFollowed 
  ? -1 * toppingsPrices.reduce((lowestPrice, topping) => {
      const price = topping.topping_prices[0].price;
      if (lowestPrice < price) {
        return price;
      } 
      else {
        return lowestPrice;
      }
    }, 0)
  : 0;
  
  const price = donPrice + toppingsPrice + discount;

  res.status(200).send({ price });
}));

export default router;