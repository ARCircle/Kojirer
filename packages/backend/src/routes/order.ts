import prisma from '@/lib/prismaClient';
import type { orders, dons } from '@prisma/client';
import { bigint2number } from '@/utils/typeConverters';
import { typedAsyncWrapper } from '@/utils/wrappers';
import express from 'express';
import util from 'util';
import { ApiError } from '@/utils/ApiError';

const COOKING = 1;
const CALLING = 2;
const FINISHED = 3;


const router = express.Router();


router.post("/", typedAsyncWrapper<"/order", "post">(async (req, res, next) => {
  const order = req.body;

  const toppings = await prisma.toppings.findMany({
    where: {
      id: {
        in: order.dons.map(don => don.toppings.map(topping => topping.id)).flat()
      }
    }
  });

  const addedOrder = await prisma.orders.create({
    include: {
      dons: {
        include: {
          adding: {
            include: {
              toppings: true
            }
          },
        }
      }
    },
    data: {
      dons: {
        create: order.dons.map((don) => {
          return {
            yasai: don.yasai,
            ninniku: don.ninniku,
            karame: don.karame,
            abura: don.abura,
            status: 1,
            sns_followed: don.snsFollowed,
            adding: {
              create: don.toppings.map((topping) => {
                return {
                  amount: topping.amount,
                  topping_id: topping.id,
                  label: toppings.find(t => t.id === topping.id)?.label
                }
              }),
              include: {
                toppings: true
              }
            },
            sizes: {
              connect: {
                id: don.size
              }
            }
          }
        })
      },
      call_num: order.callNum,
    }
  });

  const response = {
    id: bigint2number(addedOrder.id),
    callNum: addedOrder.call_num,
    createdAt: addedOrder.created_at,
    dons: addedOrder.dons.map(don => ({
      id: bigint2number(don.id),
      yasai: don.yasai,
      ninniku: don.ninniku,
      karame: don.karame,
      abura: don.abura,
      snsFollowed: don.sns_followed,
      callNum: addedOrder.call_num,
      orderId: bigint2number(don.order_id),
      size: don.size_id,
      status: don.status,
      toppings: don.adding.map(topping => ({
        id: topping.topping_id,
        amount: topping.amount,
        label: topping.toppings.label
      }))
    })),
    donsCount: addedOrder.dons.length,
    cookingDonsCount: addedOrder.dons.reduce((count, don) => don.status === COOKING ? count + 1 : count, 0),
  };

  res.status(201).json(response);

  }));

router.post("/price", typedAsyncWrapper<"/order/price", "post">(async (req, res) => {
  const dons = req.body.dons;

  if (!dons)
    throw ApiError.invalidParams();

  const prices = await Promise.all(dons.map(async (don) => {
    const reqSize = don.size;
    const reqToppings = don.toppings || [];
    const isFollowed = don.snsFollowed;

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

    return donPrice + toppingsPrice + discount;
  }, 0));

  const price = prices.reduce((now, _price) => now + _price, 0);

  res.status(200).send({ price });
}));

router.post("/status", typedAsyncWrapper<"/order/status", "post">(async (req, res, next) => {
  const status = req.body.status;

  let statusOrders: (orders & { dons: dons[] })[] = [];

  switch (status) {
    case COOKING:
      // 一つでも調理中の丼があれば，Order は調理中とする
      statusOrders = await prisma.orders.findMany({
        where: {
          dons: {
            some: {
              status: COOKING
            }
          }
        },
        orderBy: { created_at: 'asc' },
        include: {
          dons: {
            include: {
              adding: {
                include: {
                  toppings: true
                }
              }
            }
          }
        }
      });
      break;
    case CALLING:
      // 全ての丼が呼び出し中であれば，Order は呼び出し中とする
      statusOrders =　await prisma.orders.findMany({
        where: {
          dons: {
            every: {
              status: CALLING
            }
          }
        },
        orderBy: { created_at: 'asc' },
        include: {
          dons: {
            include: {
              adding: {
                include: {
                  toppings: true
                }
              }
            }
          }
        }
      });
      break;
    case FINISHED:
      // 全ての丼が完了していれば，Order は完了とする
      statusOrders = await prisma.orders.findMany({
        where: {
          dons: {
            every: {
              status: FINISHED
            }
          },
        },
        take: 10, // 受け取り完了は 10 件まで取得（無限に貯まるので）
        orderBy: { created_at: 'asc' },
        include: {
          dons: {
            include: {
              adding: {
                include: {
                  toppings: true
                }
              }
            }
          }
        }
      });
      break;
    default:
      break;
  }

  const response = statusOrders.map(order => ({
    id: bigint2number(order.id),
    callNum: order.call_num,
    createdAt: order.created_at,
    dons: order.dons.map(don => ({
      id: bigint2number(don.id),
      yasai: don.yasai,
      ninniku: don.ninniku,
      karame: don.karame,
      abura: don.abura,
      snsFollowed: don.sns_followed,
      callNum: order.call_num,
      orderId: bigint2number(don.order_id),
      size: don.size_id,
      status: don.status,
      toppings: don.adding.map(topping => ({
        id: topping.topping_id,
        amount: topping.amount,
        label: topping.toppings.label
      }))
    })),
    donsCount: order.dons.length,
    cookingDonsCount: order.dons.reduce((count, don) => don.status === COOKING ? count + 1 : count, 0), // 調理中の丼の数
  }));

  res.status(200).json(response);

}));

router.put("/status", typedAsyncWrapper<"/order/status", "put">(async (req, res, next) => {
  const orderId = req.body.orderId;
  const targetStatus = req.body.targetStatus;

  const orderDons = await prisma.dons.findMany({
    where: {
      order_id: BigInt(orderId)
    }
  });

  if (targetStatus == 3) {
    // 全ての don が 2 でない場合はエラー
    if (orderDons.some(don => don.status != 2)) {
      throw ApiError.invalidParams('you can only update status to 3 when all dons are 2');
    }
  }
  if (targetStatus == 2) {
    // 全ての don が 3 でない場合はエラー
    if (orderDons.some(don => don.status != 3)) {
      throw ApiError.invalidParams('you can only update status to 2 when all dons are 3');
    }
  }

  const updatedOrder = await prisma.orders.update({
    where: {
      id: BigInt(orderId)
    },
    data: {
      dons: {
        updateMany: {
          where: {
            order_id: BigInt(orderId)
          },
          data: {
            status: targetStatus
          }
        }
      }
    },
    include: {
      dons: {
        include: {
          adding: {
            include: {
              toppings: true
            }
          }
        }
      }
    }
  });

  const response = {
    id: bigint2number(updatedOrder.id),
    callNum: updatedOrder.call_num,
    createdAt: updatedOrder.created_at,
    dons: updatedOrder.dons.map(don => ({
      id: bigint2number(don.id),
      yasai: don.yasai,
      ninniku: don.ninniku,
      karame: don.karame,
      abura: don.abura,
      snsFollowed: don.sns_followed,
      callNum: updatedOrder.call_num,
      orderId: bigint2number(don.order_id),
      size: don.size_id,
      status: don.status,
      toppings: updatedOrder.dons.map(don => don.adding.map(topping => ({
        id: topping.topping_id,
        amount: topping.amount,
        label: topping.toppings.label
      }))).flat()
    })),
    donsCount: updatedOrder.dons.length,
    cookingDonsCount: updatedOrder.dons.filter(don => don.status == COOKING).length,
  };

  res.status(200).json(response);
}));

export default router;
