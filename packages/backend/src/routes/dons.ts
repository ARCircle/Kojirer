import express, { Router } from 'express';
import prisma from '@/lib/prismaClient';
import { typedAsyncWrapper } from '@/utils/wrappers';
import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import { components } from 'api/schema';

type Don = components['schemas']['Don'];

const router: Router = express.Router();

router.get(
  '/',
  typedAsyncWrapper<'/dons', 'get'>(async (req, res, next) => {
    const dons = await prisma.dons.findMany({
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    const resDons: Don[] = [];

    for (const don of dons) {
      const status = donStatus(don.status);
      if (!status) throw ApiError.internalProblems();

      resDons.push({
        id: don.id,
        orderId: don.order_id,
        createDatetime: don.create_datetime,
        updateDatetime: don.update_datetime,
        status,
        customizes: don.customizes.map(({ customize, is_discount }) => ({
          ...customize,
          isDiscount: is_discount,
        })),
      });
    }

    res.status(200).json(resDons);
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
