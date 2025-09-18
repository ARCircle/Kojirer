import { components } from 'api/schema';
import { ApiError } from '@/utils/ApiError';
import { donStatus } from '@/utils/status';
import prisma from '@/lib/prismaClient';

type Don = components['schemas']['Don'];

export const getDonFromIdUseCase = async (id: string): Promise<Don> => {
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

  return {
    id: don.id,
    orderId: don.order_id,
    createDatetime: don.create_datetime,
    updateDatetime: don.update_datetime,
    status,
    customizes: don.customizes.map((c) => ({
      id: c.customize.id,
      label: c.customize.label,
      available: c.customize.available,
      isDiscount: c.is_discount,
    })),
  };
};
