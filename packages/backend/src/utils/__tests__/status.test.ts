import { describe, it, expect } from 'vitest';
import { donStatus, orderStatus } from '../status';
import { dons } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('status', () => {
  it('donsStatus returns DonStatus', () => {
    const orderedStatus = donStatus(1);
    expect(orderedStatus).toBe('ordered');

    const cookingStatus = donStatus(2);
    expect(cookingStatus).toBe('cooking');

    const cookedStatus = donStatus(3);
    expect(cookedStatus).toBe('cooked');

    const deliveredStatus = donStatus(4);
    expect(deliveredStatus).toBe('delivered');

    const cancelledStatus = donStatus(5);
    expect(cancelledStatus).toBe('cancelled');
  });

  it('returns `ordered` when all the statuses are 1', () => {
    const orderId = String(randomUUID());
    const orderedDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 1,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 1,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 1,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const orderedStatus = orderStatus(orderedDons);
    expect(orderedStatus).toBe('ordered');
  });

  it('returns `ordered` when part of the status is 2 and the other are 1', () => {
    const orderId = String(randomUUID());
    const orderedDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 1,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 1,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const orderedStatus = orderStatus(orderedDons);
    expect(orderedStatus).toBe('ordered');
  });

  it('returns `orderd` when all the statuses are 2', () => {
    const orderId = String(randomUUID());
    const orderedDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const orderedStatus = orderStatus(orderedDons);
    expect(orderedStatus).toBe('ordered');
  });

  it('returns `ordered` when part of the status is 3 and the other are 2', () => {
    const orderId = String(randomUUID());
    const orderedDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 2,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const orderedStatus = orderStatus(orderedDons);
    expect(orderedStatus).toBe('ordered');
  });

  it('returns `ready` when all the statuses are 3', () => {
    const orderId = String(randomUUID());
    const readyDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const readyStatus = orderStatus(readyDons);
    expect(readyStatus).toBe('ready');
  });

  it('returns `ready` when part of the status is 4 and the other are 3', () => {
    const orderId = String(randomUUID());
    const readyDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 3,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const readyStatus = orderStatus(readyDons);
    expect(readyStatus).toBe('ready');
  });

  it('returns `delivered` when all the statuses are 4', () => {
    const orderId = String(randomUUID());
    const deliveredDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const deliveredStatus = orderStatus(deliveredDons);
    expect(deliveredStatus).toBe('delivered');
  });

  it('returns `delivered` when part of the status is 5 and the other are 4', () => {
    const orderId = String(randomUUID());
    const deliveredDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 5,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 4,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const deliveredStatus = orderStatus(deliveredDons);
    expect(deliveredStatus).toBe('delivered');
  });

  it('returns `cancelled` when all the statuses are 5', () => {
    const orderId = String(randomUUID());
    const cancelledDons: dons[] = [
      {
        id: String(randomUUID()),
        status: 5,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 5,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
      {
        id: String(randomUUID()),
        status: 5,
        order_id: orderId,
        create_datetime: new Date(),
        update_datetime: new Date(),
      },
    ];

    const cancelledStatus = orderStatus(cancelledDons);
    expect(cancelledStatus).toBe('cancelled');
  });
});
