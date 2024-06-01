import prisma from '@/lib/prismaClient.js';
import express from 'express';
import util from 'util';

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
  call_num: number;
  dons: Don[];
}

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
      res.status(400).send("invalid request: callNum and dons are required");
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
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(201).json(serializedOrder);
    next();
  } catch (e) {
    next(e);
  }
}

export default router;
