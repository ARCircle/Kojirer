import prisma from '@/lib/prismaClient.js';
import { bigint2number } from '@/utils/typeConverters.js';
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

// リクエストのモデル
interface UpdateDonStatus {
  don_id: number;
  next_status: Don[];
}

/**
 * ルーティング
 */
const router = express.Router();

// パスはファイル名からの相対パス
// ここで"/"は，"/status/"を指す
router.put("/", validateUpdateOrder, updateStatus);


/**
 * ミドルウェア
 */
// リクエストのバリデーション
function validateUpdateOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const updateDonStatus: UpdateDonStatus = req.body;

    if ((updateDonStatus.don_id == null) || (updateDonStatus.next_status == null)) {
      const received_object = util.inspect(updateDonStatus, {depth: null});
      res.status(400).send(`invalid request: dons_id or next_status are required ${received_object}`);
      return;
    }

    next();

  } catch (e) {
    next(e);
  }
}

// 注文をDBに保存して，保存した注文を返す
async function updateStatus(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const updateDonStatus: UpdateDonStatus = req.body;

    const updatedDon = await prisma.dons.update({
      where: { id: BigInt(updateDonStatus.don_id) },
      data: {
        status: {
          set: updateDonStatus.next_status
        }
      }
    });

    // updatedDonをJSONに変換する前にBigIntを処理
    const serializedOrder = JSON.parse(JSON.stringify(updatedDon, (key, value) =>
      typeof value === 'bigint' ? bigint2number(value) : value
    ));

    res.status(200).json(serializedOrder);
    next();
  } catch (e) {
    next(e);
  }
}

export default router;
