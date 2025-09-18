import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postChangeStatusCookingUsecase } from '../postChangeStatusCookingUsecase';
import { donStatus } from '../../utils/status';
import { ApiError } from '../../utils/ApiError';
import { randomUUID } from 'crypto';
import prisma from '../../lib/prismaClient';

vi.mock('../../utils/status');
vi.mock('../../lib/prismaClient', () => ({
  default: {
    dons: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockPrisma = vi.mocked(prisma) as unknown as {
  dons: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

describe('postChangeStatusCookingUsecase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ステータスを1から2に正常に変更する場合（カスタマイズあり）', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();
    const customizeId1 = randomUUID();
    const customizeId2 = randomUUID();

    const mockDon = {
      id: donId,
      order_id: orderId,
      status: 1,
    };

    const mockUpdatedDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-01'),
      update_datetime: new Date('2023-01-02'),
      status: 2,
      order: { id: orderId },
      customizes: [
        {
          id: customizeId1,
          is_discount: true,
          customize: {
            id: customizeId1,
            label: 'Extra sauce',
            available: true,
          },
        },
        {
          id: customizeId2,
          is_discount: false,
          customize: {
            id: customizeId2,
            label: 'Extra cheese',
            available: true,
          },
        },
      ],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    mockPrisma.dons.update.mockResolvedValue(mockUpdatedDon);
    vi.mocked(donStatus).mockReturnValue('cooking');

    const result = await postChangeStatusCookingUsecase(donId);

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
      },
    });

    expect(mockPrisma.dons.update).toHaveBeenCalledWith({
      where: {
        id: donId,
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

    expect(result).toEqual({
      id: mockUpdatedDon.id,
      orderId: mockUpdatedDon.order_id,
      createDatetime: mockUpdatedDon.create_datetime,
      updateDatetime: mockUpdatedDon.update_datetime,
      status: 'cooking',
      customizes: [
        {
          id: customizeId1,
          label: 'Extra sauce',
          available: true,
          isDiscount: true,
        },
        {
          id: customizeId2,
          label: 'Extra cheese',
          available: true,
          isDiscount: false,
        },
      ],
    });

    expect(donStatus).toHaveBeenCalledWith(2);
  });

  it('ステータスを1から2に正常に変更する場合（カスタマイズなし）', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();

    const mockDon = {
      id: donId,
      order_id: orderId,
      status: 1,
    };

    const mockUpdatedDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-03'),
      update_datetime: new Date('2023-01-04'),
      status: 2,
      order: { id: orderId },
      customizes: [],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    mockPrisma.dons.update.mockResolvedValue(mockUpdatedDon);
    vi.mocked(donStatus).mockReturnValue('cooking');

    const result = await postChangeStatusCookingUsecase(donId);

    expect(result).toEqual({
      id: mockUpdatedDon.id,
      orderId: mockUpdatedDon.order_id,
      createDatetime: mockUpdatedDon.create_datetime,
      updateDatetime: mockUpdatedDon.update_datetime,
      status: 'cooking',
      customizes: [],
    });
  });

  it('指定されたIDのDonが見つからない場合にApiError.invalidParamsを投げる', async () => {
    const donId = randomUUID();

    mockPrisma.dons.findUnique.mockResolvedValue(null);

    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow(ApiError);
    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow('INVAILD_PARAMS');

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
      },
    });

    expect(mockPrisma.dons.update).not.toHaveBeenCalled();
  });

  it('Donのステータスが1でない場合にApiError.invalidParamsを投げる', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();

    // ステータスが2（cooking）のDon
    const mockDon = {
      id: donId,
      order_id: orderId,
      status: 2,
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);

    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow(ApiError);
    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow('INVAILD_PARAMS');

    expect(mockPrisma.dons.findUnique).toHaveBeenCalledWith({
      where: {
        id: donId,
      },
    });

    expect(mockPrisma.dons.update).not.toHaveBeenCalled();
  });

  it('ステータスが3（completed）のDonの場合にApiError.invalidParamsを投げる', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();

    const mockDon = {
      id: donId,
      order_id: orderId,
      status: 3,
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);

    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow(ApiError);
    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow('INVAILD_PARAMS');

    expect(mockPrisma.dons.update).not.toHaveBeenCalled();
  });

  it('donStatusがundefinedを返した時にApiError.internalProblemsを投げる', async () => {
    const donId = randomUUID();
    const orderId = randomUUID();

    const mockDon = {
      id: donId,
      order_id: orderId,
      status: 1,
    };

    const mockUpdatedDon = {
      id: donId,
      order_id: orderId,
      create_datetime: new Date('2023-01-01'),
      update_datetime: new Date('2023-01-02'),
      status: 2,
      order: { id: orderId },
      customizes: [],
    };

    mockPrisma.dons.findUnique.mockResolvedValue(mockDon);
    mockPrisma.dons.update.mockResolvedValue(mockUpdatedDon);
    vi.mocked(donStatus).mockReturnValue(undefined);

    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow(ApiError);
    await expect(postChangeStatusCookingUsecase(donId)).rejects.toThrow('INTERNAL_PROBLEMS');

    expect(donStatus).toHaveBeenCalledWith(2);
  });
});