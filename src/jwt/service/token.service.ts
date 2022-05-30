import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../../auth/entity/auth.entity';
import { SignOptions } from 'jsonwebtoken';
import { RefreshToken } from '../entity/refreshToken.entity';
import { AuthenticationPayload } from '../interface/authenticationPayload.interface';

const BASE_OPTIONS = {
  issuer: '', // Todo: put the base url of the hosted backend here
  audience: '', // Todo: put the base url of the hosted frontend here,
};

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: RefreshToken,
    private readonly jwt: JwtService,
  ) {}

  async generateAccessToken(user: Auth): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    };
    return this.jwt.signAsync({}, opts);
  }

  buildResponsePayload(
    user: Auth,
    accessToken: string,
    refreshToken?: string,
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      },
    };
  }
}
