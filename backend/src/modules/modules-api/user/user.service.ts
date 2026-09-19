import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-location.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  birth_day: true,
  gender: true,
  role: true,
  avatar: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.usersSelect;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: number) {
    const profile = await this.prisma.users.findFirst({
      where: { id, is_deleted: false },
      select: profileSelect,
    });

    if (!profile) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return profile;
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    const data: UpdateProfileDto = {};
    const editableFields: (keyof UpdateProfileDto)[] = [
      'name',
      'email',
      'phone',
      'birth_day',
      'gender',
      'avatar',
    ];

    for (const field of editableFields) {
      if (dto[field] !== undefined) {
        data[field] = dto[field] as never;
      }
    }

    if (Object.keys(data).length === 0) {
      return this.getProfile(id);
    }

    try {
      const existingUser = await this.prisma.users.findFirst({
        where: { id, is_deleted: false },
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (data.email !== undefined && data.email !== existingUser.email) {
        const emailOwner = await this.prisma.users.findUnique({
          where: { email: data.email },
        });

        if (emailOwner) {
          throw new BadRequestException('Email already exists');
        }
      }

      return await this.prisma.users.update({
        where: { id, is_deleted: false },
        data: {
          ...data,
          updated_at: new Date(),
        },
        select: profileSelect,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }

        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id ${id} not found`);
        }
      }

      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  // Create User
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
      const newUser = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: passwordHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const { password, ...safeUser } = newUser;

      return safeUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Get All Users
  async findAll(query: QueryUserDto) {
    let { page, pageSize, keyword } = query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;

    const skip = (page - 1) * pageSize;

    const where: Prisma.usersWhereInput = {
      is_deleted: false,
    };

    if (keyword && typeof keyword === 'string') {
      where.OR = [
        { name: { contains: keyword } },
        { email: { contains: keyword } },
        { phone: { contains: keyword } },
      ];
    }

    const [users, totalItem] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: pageSize,
        where,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          gender: true,
          birth_day: true,
          avatar: true,
          created_at: true,
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      page,
      pageSize,
      totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items: users,
    };
  }

  // Get Detail User
  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        birth_day: true,
        avatar: true,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // Update User
  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (dto.email && dto.email !== existingUser.email) {
      throw new BadRequestException('Email cannot be updated');
    }

    const { email, ...rest } = dto;

    const dataToUpdate: any = {
      ...rest,
      updated_at: new Date(),
    };

    if (rest.password) {
      const bcrypt = await import('bcrypt');
      dataToUpdate.password = await bcrypt.hash(rest.password, 10);
    }

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: dataToUpdate,
      });

      const { password, ...safeUser } = updatedUser;
      return safeUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Delete User
  async remove(id: number) {
    const existingUser = await this.prisma.users.findUnique({ where: { id } });
    if (!existingUser)
      throw new NotFoundException(`User with id ${id} not found`);

    await this.prisma.users.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });

    return true;
  }
}
