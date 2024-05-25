import express, { Request } from 'express';
import prisma from '@/lib/prismaClient.js';

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

router.post('/price', async (req: Request<any, any, PriceBody>, res, next) => {
  const size = req.body.size;
  const toppings = req.body.toppings || [];
  const isFollowed = !!req.body.isFollowed;

  if (!size) {
    next();
    return;
  }

  try {
    const sizes = await prisma.sizes.findFirst({ 
      where: { 
        id: size,
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
          in: toppings?.map(t => t.id),
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

    if (!sizes) {
      next();
      return;
    }

    const donPrice = sizes.size_prices[0].price;
    const toppingsPrice = toppingsPrices.reduce((sum, topping) => {
      const amount = toppings.filter(t => t.id == topping.id)[0].amount;
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
  } catch(e) {
    next();
    console.error(e);
  }
});

export default router;