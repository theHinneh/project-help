import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../repository/auth.repository';
import * as dotenv from 'dotenv';
import { Auth } from '../entity/auth.entity';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<Auth> {
    const { username } = payload;
    const user = await this.authRepository.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException();
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
