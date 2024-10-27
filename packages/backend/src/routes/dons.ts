import express, { Request } from 'express';
import prisma from '@/lib/prismaClient';
import { asyncWrapper, typedAsyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';
import { bigint2number } from '@/utils/typeConverters';
import { components } from 'api/schema';

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

router.post('/price', typedAsyncWrapper<"/dons/price", "post">(async (req, res) => {
  const reqSize = req.body.size;
  const reqToppings = req.body.toppings || [];
  const isFollowed = req.body.snsFollowed;

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

//GetDonByID
//IDが指定されなかった場合，エラーメッセージを返す．
router.get('/', asyncWrapper(async (req, res, next) => {
  throw ApiError.invalidParams;

}));

//あるIDのDonの詳細を返す
router.get('/:id', typedAsyncWrapper<"/dons/{id}", "get">(async (req, res, next) => {

  //クエリパラメータを取得．
  const id = req.params.id;

  //idが非負の整数に変換できるデータか，正規表現で検証する
  if( !/^\d+$/.test(`${id}`) ){
    throw ApiError.invalidParams();
  }


  //そのIDのDonを取得する
  const don = await prisma.dons.findUnique({
    where: {
      id: Number(id),
    },
  });

  //そのIDのDonがない場合，エラーを返す．
  if(!don){
    throw ApiError.internalProblems();
  }

  const resDon = {
    ...don,
    size: don.size_id,
    id: bigint2number(don.id),
    orderId: bigint2number(don.order_id),
  };

  //とりあえずJSONで送る
  res.status(200).json(resDon);

}));

router.get('/status', typedAsyncWrapper<"/dons/status/", "get">(async (req, res, next) => {
  const status = req.query.status;
  const limit = req.query.limit? Number(req.query.limit) : 10;

  const statusDons = await prisma.dons.findMany({
    where: {
      status: status,
    },
    take: limit,
  });


  const resDons = statusDons.map(don => ({
    ...don,
    id: bigint2number(don.id),
    createdAt: don.created_at,
    size: don.size_id,
    orderId: bigint2number(don.order_id),
  }));

  res.status(200).json(resDons);

}));


export default router;
