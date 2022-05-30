import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Auth } from '../auth/entity/auth.entity';
import { AuthService } from '../auth/service/auth.service';
import { AccessTokenPayload } from './interface/accessTokenPayload.interface';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
      signOption: {
        expiresIn: '60m',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<Auth> {
    const { sub: id } = payload;
    const user = await this.authService.findById(id);
    if (!user) return null;
    return user;
  }
}

export interface JwtPayload {
  username: string;
  status: Status;
}

export enum Status {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}
