import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  // Create (Admin & Public)
  async create(dto: CreateFeedbackDto) {
    try {
      return await this.prisma.feedbacks.create({
        data: {
          ...dto,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create feedback');
    }
  }

  // Get All (Admin)
  async findAll(query: QueryFeedbackDto) {
    let { page, pageSize, keyword, type } = query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;

    const skip = (page - 1) * pageSize;

    const where: Prisma.feedbacksWhereInput = {
      is_deleted: false,
    };

    if (type && typeof type === 'string') {
      where.type = type;
    }

    if (keyword && typeof keyword === 'string') {
      where.OR = [
        { name: { contains: keyword } },
        { title: { contains: keyword } },
        { type: { contains: keyword } },
      ];
    }

    const [items, totalItem] = await Promise.all([
      this.prisma.feedbacks.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { id: 'desc' },
      }),
      this.prisma.feedbacks.count({ where }),
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
    const item = await this.prisma.feedbacks.findFirst({
      where: { id, is_deleted: false },
    });

    if (!item) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    return item;
  }

  // Update (Admin)
  async update(id: number, dto: UpdateFeedbackDto) {
    const existing = await this.prisma.feedbacks.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    try {
      return await this.prisma.feedbacks.update({
        where: { id },
        data: {
          ...dto,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update feedback');
    }
  }

  // Delete (Admin) - soft delete
  async remove(id: number, deletedBy: number) {
    const existing = await this.prisma.feedbacks.findFirst({
      where: { id, is_deleted: false },
    });

    if (!existing) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }

    await this.prisma.feedbacks.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: deletedBy,
      },
    });

    return true;
  }
}
