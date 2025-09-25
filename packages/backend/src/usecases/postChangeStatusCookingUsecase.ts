import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import { components } from 'api/schema';
import prisma from '@/lib/prismaClient';

type Don = components['schemas']['Don'];

export const postChangeStatusCookingUsecase = async (id: string): Promise<Don> => {
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

  return {
    id: updatedDon.id,
    orderId: updatedDon.order_id,
    createDatetime: updatedDon.create_datetime,
    updateDatetime: updatedDon.update_datetime,
    status,
    customizes: updatedDon.customizes.map((c) => ({
      id: c.id,
      label: c.customize.label,
      available: c.customize.available,
      isDiscount: c.is_discount,
    })),
  };
};
