import prisma from '@/lib/prismaClient';
import { dons } from '@prisma/client';
import { bigint2number } from '@/utils/typeConverters';
import { typedAsyncWrapper } from '@/utils/wrappers';
import express from 'express';
import util from 'util';
import { ApiError } from '@/utils/ApiError';

const COOKING = 1;
const CALLING = 2;
const FINISHED = 3;

/**
 * モデル
 */
// 丼のモデル
interface Don {
  size: number;
  yasai: number;
  ninniku: number;
  karame: number;
  abura: number;
  toppings: {
    id: number;
    label: string;
    amount: number;
  }[];
  sns_followed: boolean;
}

// 注文のモデル
interface Order {
  id: number;
  call_num: number;
  created_at: Date;
  dons: Don[];
}

type orders = {
  id: bigint;
  created_at: Date;
  call_num: number;
  dons: dons[]; // prismのorders型そのまま使うとdonsがなかったので独自定義
};


/**
 * ルーティング
 */
const router = express.Router();

// パスはファイル名からの相対パス
// ここで"/"は，"/order/"を指す
router.post("/", validateNewOrder, saveOrder);


/**
 * ミドルウェア
 */
// リクエストのバリデーション
// zodとか使えばいいけど，一旦見送りで
// 型チェックできてないので，数値がfloatできた場合とか，InternalServerErrorになる気がします
function validateNewOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const order: Order = req.body;

    if ((order.call_num == null) || (order.dons == null) || !Array.isArray(order.dons)) {
      const received_object = util.inspect(order, {depth: null});
      res.status(400).send(`invalid request: callNum and dons are required
      you sent : ${received_object}
      `);
      return;
    }

    for (const don of order.dons) {
      if ((don.size == null) ||
          (don.yasai == null) ||
          (don.ninniku == null) ||
          (don.karame == null) ||
          (don.abura == null) ||
          (don.toppings == null) ||
          !Array.isArray(don.toppings) ||
          (don.sns_followed == null)) {
        const received_object = util.inspect(order, {depth: null});
        res.status(400).send(`invalid request: size, yasai, ninniku, karame, abura, toppings, and sns_followed are required
        you sent : ${received_object}
        `);
        return;
      }

      for (const topping of don.toppings) {
        if ((topping.id == null) || (topping.label == null) || (topping.amount == null)) {
          const received_object = util.inspect(order, {depth: null});
          res.status(400).send(`invalid request: id, label, and amount are required
          you sent : ${received_object}
          `);
          return;
        }
      }
    }

    if (order.dons.length === 0) {
      res.status(400).send("dons must not be empty");
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
}

// 注文をDBに保存して，保存した注文を返す
async function saveOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const order: Order = req.body;

    const addedOrder = await prisma.orders.create({
      include: {
        dons: {
          include: {
            adding: true
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
              sns_followed: don.sns_followed,
              adding: {
                create: don.toppings.map((topping) => {
                  return {
                    amount: topping.amount,
                    topping_id: topping.id
                  }
                })
              },
              sizes: {
                connect: {
                  id: don.size
                }
              }
            }
          })
        },
        call_num: order.call_num,
      }
    });

    // addedOrderをJSONに変換する前にBigIntを処理
    const serializedOrder = JSON.parse(JSON.stringify(addedOrder, (key, value) =>
      typeof value === 'bigint' ? bigint2number(value) : value
    ));

    res.status(201).json(serializedOrder);
    next();
  } catch (e) {
    next(e);
  }
}

router.post("/status", typedAsyncWrapper<"/order/status", "post">(async (req, res, next) => {
  const status = req.body.status;

  let statusOrders: orders[] = [];

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
        include: {
          dons: true
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
        include: {
          dons: true
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
          }
        },
        include: {
          dons: true
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
      dons: true
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
    })),
    donsCount: updatedOrder.dons.length,
    cookingDonsCount: updatedOrder.dons.filter(don => don.status == COOKING).length,
  };

  res.status(200).json(response);
}));

export default router;
