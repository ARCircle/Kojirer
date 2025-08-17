import prisma from '@/lib/prismaClient';
import { ApiError } from '@/utils/ApiError';
import { calcPrice } from '@/utils/calcPrice';
import { donStatus, orderStatus } from '@/utils/status';
import { typedAsyncWrapper } from '@/utils/wrappers';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get(
  '/:id',
  typedAsyncWrapper<'/orders/{id}', 'get'>(async (req, res, next) => {
    const id = req.params.id;

    const order = await prisma.orders.findUnique({
      where: {
        id,
      },
      include: {
        dons: {
          include: {
            customizes: {
              include: {
                customize: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw ApiError.invalidParams();
    }

    res.status(200).json({
      id: order.id,
      createDatetime: order.create_datetime,
      callNum: order.call_num,
      status: orderStatus(order.dons),
      dons: order.dons.map((don) => ({
        id: don.id,
        orderId: order.id,
        status: donStatus(don.status) || 'ordered',
        createDatetime: don.create_datetime,
        updateDatetime: don.update_datetime,
        customise: don.customizes.map((customise) => ({
          id: customise.customize_id,
          label: customise.customize.label,
        })),
      })),
    });
  }),
);

router.post(
  '/',
  typedAsyncWrapper<'/orders', 'post'>(async (req, res, next) => {
    const order = req.body;

    await prisma.orders.create({
      include: {
        dons: {
          include: {
            customizes: true,
          },
        },
      },
      data: {
        dons: {
          create: order.dons.map((don) => {
            return {
              status: 1,
              customizes: {
                create: don.customizes?.map((customize) => ({
                  customize_id: customize.id,
                })),
              },
            };
          }),
        },
        call_num: order.callNum,
        num_sns_followed: order.numSnsFollowed,
      },
    });

    const customizes = order.dons
      .map((don) => don.customizes)
      .flat()
      .filter((c) => c !== undefined && c !== null);
    const price = await calcPrice(customizes);

    res.status(201).json({ price });
  }),
);

export default router;
