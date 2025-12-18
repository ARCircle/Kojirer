import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import { components } from 'api/schema';
import prisma from '@/lib/prismaClient';

type ActiveDon = components['schemas']['ActiveDon'];

export const getActiveDons = async (): Promise<ActiveDon[]> => {
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

  const resDons: ActiveDon[] = dons
    .map((don) => {
      const status = donStatus(don.status);
      if (!status) throw ApiError.internalProblems();

      const isActive = status !== 'delivered' && status !== 'cancelled';
      if (!isActive) return null;

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
    })
    .filter((don) => don !== null);

  return resDons;
};
