import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import { components } from 'api/schema';
import prisma from '@/lib/prismaClient';

type Don = components['schemas']['Don'];

export const getAllDons = async (): Promise<Don[]> => {
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

  const resDons: Don[] = dons.map((don) => {
    const status = donStatus(don.status);
    if (!status) throw ApiError.internalProblems();

    return {
      id: don.id,
      orderId: don.order_id,
      createDatetime: don.create_datetime,
      updateDatetime: don.update_datetime,
      status,
      customizes: don.customizes.map(({ customize, is_discount }) => ({
        ...customize,
        isDiscount: is_discount,
      })),
    };
  });

  return resDons;
};
