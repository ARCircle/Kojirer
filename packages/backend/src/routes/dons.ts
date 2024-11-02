import express, { Request } from 'express';
import prisma from '@/lib/prismaClient';
import { asyncWrapper, typedAsyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';
import { bigint2number } from '@/utils/typeConverters';
import { components } from 'api/schema';


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


router.get('/', typedAsyncWrapper<"/dons", "get">(async (req, res, next) => {
  const dons = await prisma.dons.findMany(
    {
      include: {
        orders: true,
      },
    }
  );

  const resDons = dons.map(don => ({
    size: don.size_id,
    callNum: don.orders.call_num,
    orderId: bigint2number(don.order_id),
    id: bigint2number(don.id),
    createdAt: don.created_at,
    yasai: don.yasai,
    ninniku: don.ninniku,
    abura: don.abura,
    karame: don.karame,
    status: don.status,
  }));
  res.status(200).send(resDons);
}));


router.get('/:id', typedAsyncWrapper<"/dons/{id}", "get">(async (req, res, next) => {
  const id = req.params.id;

  // idが非負の整数に変換できるデータか，正規表現で検証する
  if( !/^\d+$/.test(`${id}`) ){
    throw ApiError.invalidParams();
  }


  // そのIDのDonを取得する
  const don = await prisma.dons.findUnique({
    where: {
      id: Number(id),
    },
  });

  const order = await prisma.orders.findFirstOrThrow({
    where: {
      id: Number(don?.order_id),
    },
  });

  // そのIDのDonがない場合，エラーを返す．
  if(!don){
    throw ApiError.internalProblems();
  }

  const resDon = {
    size: don.size_id,
    id: bigint2number(don.id),
    orderId: bigint2number(don.order_id),
    callNum: order.call_num,
    createdAt: don.created_at,
    yasai: don.yasai,
    ninniku: don.ninniku,
    abura: don.abura,
    karame: don.karame,
    status: don.status,
  };

  res.status(200).send(resDon);

}));


router.post('/status/', typedAsyncWrapper<"/dons/status/", "post">(async (req, res, next) => {
  const status = req.body.status;
  const limit = req.body.limit ? Number(req.body.limit) : 10;

  const statusDons = await prisma.dons.findMany({
    where: {
      status: status,
    },
    orderBy: { created_at: 'asc' },
    take: limit,
    include: {
      orders: true,
      adding: {
        include: {
          toppings: true,
        },
      },
    },
  });


  const resDons = statusDons.map(don => ({
    id: bigint2number(don.id),
    createdAt: don.created_at,
    size: don.size_id,
    orderId: bigint2number(don.order_id),
    callNum: don.orders.call_num,
    yasai: don.yasai,
    ninniku: don.ninniku,
    abura: don.abura,
    karame: don.karame,
    status: don.status,
    toppings: don.adding.map(adding => ({
      id: adding.toppings.id,
      label: adding.toppings.label,
      amount: adding.amount
    })),
  }));


  res.status(200).json(resDons);

}));


router.put('/:id', typedAsyncWrapper<"/dons/{id}", "put">(async (req, res, next) => {
  const id = req.params.id;
  const status = req.body.status;

  if (status != 1 && status != 2) {
    if (status != 3) {
      throw ApiError.invalidParams('You can only update status to 1, 2.');
    }
    if (status == 3) {
      throw ApiError.invalidParams('Status 3 cannot be updated.');
    }
  }

  const nextStatus = status + 1;

  const updatedDon = await prisma.dons.update({
    where: {
      id: id,
    },
    data: {
      status: nextStatus,
    },
    include: {
      orders: true,
    },
  })

  const response = {
    id: bigint2number(updatedDon.id),
    size: updatedDon.size_id,
    orderId: bigint2number(updatedDon.order_id),
    callNum: updatedDon.orders.call_num,
    createdAt: updatedDon.created_at,
    yasai: updatedDon.yasai,
    ninniku: updatedDon.ninniku,
    abura: updatedDon.abura,
    karame: updatedDon.karame,
    status: updatedDon.status,
  }

  res.status(200).json(response);
}));


export default router;
