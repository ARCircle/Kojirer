import { dons } from '@prisma/client';

type DonStatus = 'ordered' | 'cooking' | 'cooked' | 'delivered' | 'cancelled';
type OrderStatus = 'ordered' | 'ready' | 'delivered' | 'cancelled';

export function donStatus(status: number): DonStatus | undefined {
  switch (status) {
    case 1:
      return 'ordered';
    case 2:
      return 'cooking';
    case 3:
      return 'cooked';
    case 4:
      return 'delivered';
    case 5:
      return 'cancelled';
    default:
      return undefined;
  }
}

export function orderStatus(dons: dons[]): OrderStatus | undefined {
  const status = dons.map((don) => don.status);
  const orderSize = dons.length;
  let readyCounter = 0;
  let deliveredCounter = 0;
  let cancelledCounter = 0;

  for (const state of status) {
    if (state <= 2) return 'ordered';
    else if (state == 3) readyCounter++;
    else if (state == 4) deliveredCounter++;
    else if (state == 5) cancelledCounter++;
  }

  if (readyCounter > 1) return 'ready';
  else if (deliveredCounter > 1) return 'delivered';
  else if (cancelledCounter == orderSize) return 'cancelled';
}
