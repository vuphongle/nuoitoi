import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateLixiSessionDto } from './dto/create-lixi-session.dto';
import { UpdateLixiSessionDto } from './dto/update-lixi-session.dto';
import { QueryLixiSessionDto } from './dto/query-lixi-session.dto';

const publicSelect = {
  id: true,
  code: true,
  name: true,
  tagline: true,
  bank: true,
  account: true,
  owner: true,
  content: true,
  qr: true,
  avatar: true,
  sort_order: true,
} satisfies Prisma.lixi_sessionsSelect;

@Injectable()
export class LixiSessionService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCodeAvailable(code: string, excludeId?: number) {
    const existing = await this.prisma.lixi_sessions.findUnique({
      where: { code },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException(`Code "${code}" đã tồn tại`);
    }
  }

  // Create (Admin)
  async create(dto: CreateLixiSessionDto) {
    await this.ensureCodeAvailable(dto.code);

    try {
      return await this.prisma.lixi_sessions.create({
        data: {
          ...dto,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(`Code "${dto.code}" đã tồn tại`);
      }
      throw new InternalServerErrorException('Failed to create lixi session');
    }
  }

  // Get All (Admin)
  async findAll(query: QueryLixiSessionDto) {
    let { page, pageSize, keyword } = query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;

    const skip = (page - 1) * pageSize;

    const where: Prisma.lixi_sessionsWhereInput = {
      is_deleted: false,
    };

    if (keyword && typeof keyword === 'string') {
      where.OR = [
        { code: { contains: keyword } },
        { name: { contains: keyword } },
        { owner: { contains: keyword } },
        { bank: { contains: keyword } },
      ];
    }

    const [items, totalItem] = await Promise.all([
      this.prisma.lixi_sessions.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { sort_order: 'asc' },
      }),
      this.prisma.lixi_sessions.count({ where }),
    ]);

    return {
      page,
      pageSize,
      totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items,
    };
  }

  // Get Detail (Admin)
  async findOne(id: number) {
    const item = await this.prisma.lixi_sessions.findFirst({
      where: { id, is_deleted: false },
    });

    if (!item) {
      throw new NotFoundException(`Lixi session with id ${id} not found`);
    }

    return item;
  }

  // Update (Admin)
  async update(id: number, dto: UpdateLixiSessionDto) {
    const existing = await this.prisma.lixi_sessions.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundException(`Lixi session with id ${id} not found`);
    }

    if (dto.code && dto.code !== existing.code) {
      await this.ensureCodeAvailable(dto.code, id);
    }

    try {
      return await this.prisma.lixi_sessions.update({
        where: { id },
        data: {
          ...dto,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(`Code "${dto.code}" đã tồn tại`);
      }
      throw new InternalServerErrorException('Failed to update lixi session');
    }
  }

  // Delete (Admin) - soft delete
  async remove(id: number, deletedBy: number) {
    const existing = await this.prisma.lixi_sessions.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundException(`Lixi session with id ${id} not found`);
    }

    await this.prisma.lixi_sessions.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: deletedBy,
      },
    });

    return true;
  }

  // Get list (Public)
  async findAllPublic() {
    return this.prisma.lixi_sessions.findMany({
      where: { is_deleted: false },
      orderBy: { sort_order: 'asc' },
      select: publicSelect,
    });
  }

  // Get detail by code (Public)
  async findOnePublicByCode(code: string) {
    const item = await this.prisma.lixi_sessions.findFirst({
      where: { code, is_deleted: false },
      select: publicSelect,
    });

    if (!item) {
      throw new NotFoundException(`Lixi session with code ${code} not found`);
    }

    return item;
  }
}
