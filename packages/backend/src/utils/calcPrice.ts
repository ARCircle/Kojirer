import { components, paths } from 'api/schema';
import prisma from '@/lib/prismaClient';

type Customize = components['schemas']['Customize'];

export async function calcPrice(customizes: Customize[]) {
  const customizePrices = await prisma.customizes.findMany({
    where: {
      id: {
        in: customizes?.map((t) => t.id),
      },
    },
    include: {
      customize_prices: {
        select: {
          price: true,
        },
        orderBy: { since: 'desc' },
        take: 1,
      },
    },
  });

  const price = customizePrices.reduce((sum, customise) => {
    const c = customizes?.find((_c) => _c.id == customise.id);
    const p = c?.isDiscount ? 0 : customise.customize_prices[0].price;

    return sum + p;
  }, 0);

  return price;
}
