import express, { Router } from 'express';
import prisma from '@/lib/prismaClient';
import { typedAsyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import { getActiveDons } from '@/usecases/getActiveDonsUsecase';

const router: Router = express.Router();

router.get(
  '/',
  typedAsyncWrapper<'/dons', 'get'>(async (req, res, next) => {
    const dons = await getActiveDons();
    res.status(200).json(dons);
  }),
);

router.get(
  '/:id',
  typedAsyncWrapper<'/dons/{id}', 'get'>(async (req, res, next) => {
    const id = req.params.id;

    // そのIDのDonを取得する
    const don = await prisma.dons.findUnique({
      where: {
        id: id,
      },
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    // そのIDのDonがない場合，エラーを返す．
    if (!don) {
      throw ApiError.internalProblems();
    }

    const status = donStatus(don.status);
    if (!status) throw ApiError.internalProblems();

    const resDon = {
      id: don.id,
      orderId: don.order_id,
      createDatetime: don.create_datetime,
      updateDatetime: don.update_datetime,
      status,
      customize: don.customizes,
    };

    res.status(200).send(resDon);
  }),
);

router.post(
  '/cooking',
  typedAsyncWrapper<'/dons/cooking', 'post'>(async (req, res, next) => {
    const id = req.body.donId;

    const don = await prisma.dons.findUnique({
      where: {
        id: id,
      },
    });

    if (!don) throw ApiError.invalidParams();
    if (don.status != 1) throw ApiError.invalidParams();

    const updatedDon = await prisma.dons.update({
      where: {
        id,
      },
      data: {
        status: 2,
      },
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    const status = donStatus(updatedDon.status);
    if (!status) throw ApiError.internalProblems();

    const resDon = {
      id: updatedDon.id,
      orderId: updatedDon.order_id,
      createDatetime: updatedDon.create_datetime,
      updateDatetime: updatedDon.update_datetime,
      status,
      customize: updatedDon.customizes,
    };

    res.status(200).json(resDon);
  }),
);

router.post(
  '/cooked',
  typedAsyncWrapper<'/dons/cooked', 'post'>(async (req, res, next) => {
    const id = req.body.donId;

    const don = await prisma.dons.findUnique({
      where: {
        id: id,
      },
    });

    if (!don) throw ApiError.invalidParams();
    if (don.status != 2) throw ApiError.invalidParams();

    const updatedDon = await prisma.dons.update({
      where: {
        id,
      },
      data: {
        status: 3,
      },
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    const status = donStatus(updatedDon.status);
    if (!status) throw ApiError.internalProblems();

    const resDon = {
      id: updatedDon.id,
      orderId: updatedDon.order_id,
      createDatetime: updatedDon.create_datetime,
      updateDatetime: updatedDon.update_datetime,
      status,
      customize: updatedDon.customizes,
    };

    res.status(200).json(resDon);
  }),
);

router.post(
  '/delivered',
  typedAsyncWrapper<'/dons/delivered', 'post'>(async (req, res, next) => {
    const id = req.body.donId;

    const don = await prisma.dons.findUnique({
      where: {
        id: id,
      },
    });

    if (!don) throw ApiError.invalidParams();
    if (don.status != 3) throw ApiError.invalidParams();

    const updatedDon = await prisma.dons.update({
      where: {
        id,
      },
      data: {
        status: 4,
      },
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    const status = donStatus(updatedDon.status);
    if (!status) throw ApiError.internalProblems();

    const resDon = {
      id: updatedDon.id,
      orderId: updatedDon.order_id,
      createDatetime: updatedDon.create_datetime,
      updateDatetime: updatedDon.update_datetime,
      status,
      customize: updatedDon.customizes,
    };

    res.status(200).json(resDon);
  }),
);

router.post(
  '/cancel',
  typedAsyncWrapper<'/dons/cancel', 'post'>(async (req, res, next) => {
    const id = req.body.donId;

    const don = await prisma.dons.findUnique({
      where: {
        id: id,
      },
    });

    if (!don) throw ApiError.invalidParams();

    const updatedDon = await prisma.dons.update({
      where: {
        id,
      },
      data: {
        status: 5,
      },
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    const status = donStatus(updatedDon.status);
    if (!status) throw ApiError.internalProblems();

    const resDon = {
      id: updatedDon.id,
      orderId: updatedDon.order_id,
      createDatetime: updatedDon.create_datetime,
      updateDatetime: updatedDon.update_datetime,
      status,
      customize: updatedDon.customizes,
    };

    res.status(200).json(resDon);
  }),
);

export default router;
