import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllDons } from '../getAllDonUsecase';
import { donStatus } from '../../utils/status';
import { randomUUID } from 'crypto';
import prisma from '../../lib/prismaClient';

vi.mock('../../utils/status');
vi.mock('../../lib/prismaClient', () => ({
  default: {
    dons: {
      findMany: vi.fn(),
    },
  },
}));

const mockPrisma = vi.mocked(prisma) as unknown as {
  dons: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

describe('getAllDons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('カスタマイズを含むDonデータを返す場合', async () => {
    const mockDons = [
      {
        id: randomUUID(),
        order_id: randomUUID(),
        create_datetime: new Date('2023-01-01'),
        update_datetime: new Date('2023-01-02'),
        status: 1,
        order: { id: randomUUID() },
        customizes: [
          {
            is_discount: true,
            customize: {
              id: randomUUID(),
              name: 'Extra sauce',
              price: 100,
            },
          },
          {
            is_discount: false,
            customize: {
              id: randomUUID(),
              name: 'Extra cheese',
              price: 200,
            },
          },
        ],
      },
      {
        id: randomUUID(),
        order_id: randomUUID(),
        create_datetime: new Date('2023-01-03'),
        update_datetime: new Date('2023-01-04'),
        status: 2,
        order: { id: randomUUID() },
        customizes: [],
      },
    ];

    mockPrisma.dons.findMany.mockResolvedValue(mockDons);
    vi.mocked(donStatus).mockReturnValueOnce('ordered').mockReturnValueOnce('cooking');

    const result = await getAllDons();

    expect(mockPrisma.dons.findMany).toHaveBeenCalledWith({
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });

    expect(result).toEqual([
      {
        id: mockDons[0].id,
        orderId: mockDons[0].order_id,
        createDatetime: mockDons[0].create_datetime,
        updateDatetime: mockDons[0].update_datetime,
        status: 'ordered',
        customizes: [
          {
            id: mockDons[0].customizes[0].customize.id,
            name: 'Extra sauce',
            price: 100,
            isDiscount: true,
          },
          {
            id: mockDons[0].customizes[1].customize.id,
            name: 'Extra cheese',
            price: 200,
            isDiscount: false,
          },
        ],
      },
      {
        id: mockDons[1].id,
        orderId: mockDons[1].order_id,
        createDatetime: mockDons[1].create_datetime,
        updateDatetime: mockDons[1].update_datetime,
        status: 'cooking',
        customizes: [],
      },
    ]);

    expect(donStatus).toHaveBeenCalledWith(1);
    expect(donStatus).toHaveBeenCalledWith(2);
  });

  it('donStatusがundefinedを返した時にApiErrorを投げる', async () => {
    const mockDons = [
      {
        id: randomUUID(),
        order_id: randomUUID(),
        create_datetime: new Date(),
        update_datetime: new Date(),
        status: 999,
        order: { id: randomUUID() },
        customizes: [],
      },
    ];

    mockPrisma.dons.findMany.mockResolvedValue(mockDons);
    vi.mocked(donStatus).mockReturnValue(undefined);

    await expect(getAllDons()).rejects.toThrow();

    expect(donStatus).toHaveBeenCalledWith(999);
  });

  it('Donが見つからない場合は空配列を返す', async () => {
    mockPrisma.dons.findMany.mockResolvedValue([]);

    const result = await getAllDons();

    expect(result).toEqual([]);
    expect(mockPrisma.dons.findMany).toHaveBeenCalledWith({
      include: {
        order: true,
        customizes: {
          include: {
            customize: true,
          },
        },
      },
    });
  });

  it('カスタマイズが空配列のDonを正常に処理する', async () => {
    const mockDons = [
      {
        id: randomUUID(),
        order_id: randomUUID(),
        create_datetime: new Date(),
        update_datetime: new Date(),
        status: 3,
        order: { id: randomUUID() },
        customizes: [],
      },
    ];

    mockPrisma.dons.findMany.mockResolvedValue(mockDons);
    vi.mocked(donStatus).mockReturnValue('cooked');

    const result = await getAllDons();

    expect(result).toHaveLength(1);
    expect(result[0].customizes).toEqual([]);
  });
});
