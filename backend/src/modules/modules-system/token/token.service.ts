import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from '../../../common/constant/app.constant';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  createTokens(userId, role) {
    //Chuyền vào (userId, ACCESS_TOKEN_SECRET, {expiresIn: "1d"} - Hạn tồn tại 1 ngày)
    const accessToken = this.jwtService.sign(
      { userId: userId, role: role },

      {
        secret: ACCESS_TOKEN_SECRET,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId, role: role },

      {
        secret: REFRESH_TOKEN_SECRET,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  verifyAccessToken(accessToken, option) {
    const decodeAccessToken = this.jwtService.verify(
      accessToken,

      {
        secret: ACCESS_TOKEN_SECRET,
        ...option,
      },
    );
    return decodeAccessToken;
  }
  verifyRefreshToken(refreshToken) {
    const decodeRefreshToken = this.jwtService.verify(refreshToken, {
      secret: REFRESH_TOKEN_SECRET,
    });
    return decodeRefreshToken;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    console.log('validate', payload);
    return {
      id: payload.userId,
      role: payload.role,
    };
  }
}
