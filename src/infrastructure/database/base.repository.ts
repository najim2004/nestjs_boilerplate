import { PrismaService } from './prisma.service';
import { IPaginatedResult } from '@/shared/interfaces/paginated-result.interface';

type ModelDelegate<T> = {
  findMany: (args: Record<string, unknown>) => Promise<T[]>;
  findUnique: (args: Record<string, unknown>) => Promise<T | null>;
  create: (args: { data: unknown }) => Promise<T>;
  update: (args: { where: { id: string }; data: unknown }) => Promise<T>;
  delete: (args: { where: { id: string } }) => Promise<T>;
  count: (args?: Record<string, unknown>) => Promise<number>;
};

export abstract class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelDelegate: ModelDelegate<T>,
  ) {}

  async findAll(
    where: Record<string, unknown> = {},
    orderBy: Record<string, string> = { createdAt: 'desc' },
  ): Promise<T[]> {
    return this.modelDelegate.findMany({ where, orderBy });
  }

  async findById(id: string): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    });
  }

  async create(data: Record<string, unknown>): Promise<T> {
    return this.modelDelegate.create({ data });
  }

  async update(id: string, data: Record<string, unknown>): Promise<T> {
    return this.modelDelegate.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.modelDelegate.delete({ where: { id } });
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
      }),
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
