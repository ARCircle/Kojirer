import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDonFromIdUseCase } from '../getDonFromIdUsecase';
import { donStatus } from '../../utils/status';
import { ApiError } from '../../utils/ApiError';
import { randomUUID } from 'crypto';
import prisma from '../../lib/prismaClient';

vi.mock('../../utils/status');
vi.mock('../../lib/prismaClient', () => ({
  default: {
    dons: {
      findUnique: vi.fn(),
    },
  },
}));

const mockPrisma = vi.mocked(prisma) as unknown as {
  dons: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

describe('getDonFromIdUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('指定されたIDのDonを正常に取得する場合', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();
    const mockDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-01'),
      update_datetime: new Date('2023-01-02'),
      status: 1,
      order: { id: orderId },
      customizes: [
        {
          is_discount: true,
          customize: {
            id: randomUUID(),
            label: 'Extra sauce',
            available: true,
            price: 100,
          },
        },
        {
          is_discount: false,
          customize: {
            id: randomUUID(),
            label: 'Extra cheese',
            available: true,
            price: 200,
          },
        },
      ],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    vi.mocked(donStatus).mockReturnValue('ordered');

    const result = await getDonFromIdUseCase(donId);

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
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

    expect(result).toEqual({
      id: mockDon.id,
      orderId: mockDon.order_id,
      createDatetime: mockDon.create_datetime,
      updateDatetime: mockDon.update_datetime,
      status: 'ordered',
      customizes: mockDon.customizes.map((c) => ({
        id: c.customize.id,
        label: c.customize.label,
        available: c.customize.available,
        isDiscount: c.is_discount,
      })),
    });

    expect(donStatus).toHaveBeenCalledWith(1);
  });

  it('カスタマイズがないDonを正常に取得する場合', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();
    const mockDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-03'),
      update_datetime: new Date('2023-01-04'),
      status: 2,
      order: { id: orderId },
      customizes: [],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    vi.mocked(donStatus).mockReturnValue('cooking');

    const result = await getDonFromIdUseCase(donId);

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
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

    expect(result).toEqual({
      id: mockDon.id,
      orderId: mockDon.order_id,
      createDatetime: mockDon.create_datetime,
      updateDatetime: mockDon.update_datetime,
      status: 'cooking',
      customizes: [],
    });

    expect(donStatus).toHaveBeenCalledWith(2);
  });

  it('指定されたIDのDonが見つからない場合にApiErrorを投げる', async () => {
    const donId = randomUUID();

    mockPrisma.dons.findUnique.mockResolvedValue(null);

    await expect(getDonFromIdUseCase(donId)).rejects.toThrow(ApiError);
    await expect(getDonFromIdUseCase(donId)).rejects.toThrow('INTERNAL_PROBLEMS');

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
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
  });

  it('donStatusがundefinedを返した時にApiErrorを投げる', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();
    const mockDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-01'),
      update_datetime: new Date('2023-01-02'),
      status: 999, // 無効なステータス
      order: { id: orderId },
      customizes: [],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    vi.mocked(donStatus).mockReturnValue(undefined);

    await expect(getDonFromIdUseCase(donId)).rejects.toThrow(ApiError);
    await expect(getDonFromIdUseCase(donId)).rejects.toThrow('INTERNAL_PROBLEMS');

    expect(donStatus).toHaveBeenCalledWith(999);
  });
});
