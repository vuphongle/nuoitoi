import { PrismaService } from './../../modules-system/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';

import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../modules-system/token/token.service';
import { RegisterDto } from './dto/register.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    console.log({ email, password });
    const userExist = await this.prisma.users.findUnique({
      where: { email: email },
    });
    if (!userExist)
      throw new BadRequestException('Email does not exist, please register!');
    //Nếu code chạy đc tới đây => Đảm bảo có userExist

    // do tài khoản đăng nhập bằng gmail hoặc facebook
    // lúc này tài khoản sẽ không có mật khẩu
    // nên nếu người dùng cố tình đăng nhập bằng email thì sẽ không có mật khẩu để kiểm tra
    // nên phải bắt người dùng đăng nhập bằng email vào setting để cập nhật lại mật khẩu mới
    if (!userExist.password) {
      throw new BadRequestException(
        'Please log in with social network (gmail, facebook) to update new password in setting',
      );
    }

    const isPassword = bcrypt.compareSync(password, userExist.password);
    if (!isPassword) throw new BadRequestException('Mật Khẩu không chính xác!');
    //Nếu code chạy đc tới đây => Đảm bảo có password chính xác

    const tokens = this.tokenService.createTokens(userExist.id, userExist.role);
    // sendMail(userExist.email);

    return tokens;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, birth_day, phone, gender, avatar } =
      registerDto;

    // Check if email exists
    const userExist = await this.prisma.users.findUnique({
      where: { email },
    });
    if (userExist) {
      throw new BadRequestException('Email đã tồn tại!');
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create new user
    await this.prisma.users.create({
      data: {
        email,
        password: passwordHash,
        name,
        birth_day,
        phone,
        gender,
        avatar,
        role: 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        created_at: true,
      },
    });

    return true;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
