import { PrismaService } from './prisma.service.js';
import { IPaginatedResult } from '@/shared/interfaces/paginated-result.interface.js';

type ModelDelegate = {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
  count: (args?: Record<string, unknown>) => Promise<number>;
};

export abstract class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: ModelDelegate,
  ) {}

  async findAll(
    where: Record<string, unknown> = {},
    orderBy: Record<string, string> = { createdAt: 'desc' },
  ): Promise<T[]> {
    return this.modelDelegate.findMany({ where, orderBy }) as Promise<T[]>;
  }

  async findById(id: string): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    }) as Promise<T | null>;
  }

  async create(data: Record<string, unknown>): Promise<T> {
    return this.modelDelegate.create({ data }) as Promise<T>;
  }

  async update(id: string, data: Record<string, unknown>): Promise<T> {
    return this.modelDelegate.update({ where: { id }, data }) as Promise<T>;
  }

  async delete(id: string): Promise<T> {
    return this.modelDelegate.delete({ where: { id } }) as Promise<T>;
  }

  async count(where: Record<string, unknown> = {}): Promise<number> {
    return this.modelDelegate.count({ where });
  }

  async paginate(
    page: number,
    limit: number,
    where: Record<string, unknown> = {},
    orderBy: Record<string, string> = { createdAt: 'desc' },
  ): Promise<IPaginatedResult<T>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.modelDelegate.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }) as Promise<T[]>,
      this.modelDelegate.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
