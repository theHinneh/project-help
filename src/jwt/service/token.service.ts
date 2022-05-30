import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../../auth/entity/auth.entity';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from '../entity/refreshToken.entity';
import { RefreshTokenPayload } from '../interface/refreshTokenPayload';
import e from 'express';
import { AuthService } from '../../auth/service/auth.service';
import { AuthenticationPayload } from '../interface/authenticationPayload.interface';

const BASE_OPTIONS = {
  issuer: 'https://nsawam-road-coc-backend.herokuapp.com',
  audience: 'https://nr-data.herokuapp.com',
};

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: RefreshToken,
    private readonly jwt: JwtService,
    private authService: AuthService,
  ) {}

  async generateAccessToken(user: Auth): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
    };
    return this.jwt.signAsync({}, opts);
  }

  async generateRefreshToken(user: Auth, expiresIn: number): Promise<string> {
    const token = await this.createRefreshToken(user, expiresIn);
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      jwtid: String(token.id),
    };
    return this.jwt.signAsync({}, opts);
  }

  async resolveRefreshToken(
    encoded: string,
  ): Promise<{ user: Auth; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token)
      throw new UnprocessableEntityException('Refresh token not found');
    if (token.is_revoked)
      throw new UnprocessableEntityException('Refresh token revoked');

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user)
      throw new UnprocessableEntityException('Refresh token malformed');

    return { user, token };
  }

  async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: Auth }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);
    return { user, token };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return await this.jwt.verifyAsync(token);
    } catch (err) {
      if (e instanceof TokenExpiredError)
        throw new UnprocessableEntityException('Refresh token expired');
      else throw new UnprocessableEntityException('Refresh token malformed');
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<Auth> {
    const subId = payload.sub;
    if (!subId)
      throw new UnprocessableEntityException('Refresh token malformed');
    return await this.authService.findById(subId);
  }

  async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;
    if (!tokenId)
      throw new UnprocessableEntityException('Refresh token malformed');
    return this.findTokenById(tokenId);
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

  async createRefreshToken(user: Auth, ttl: number): Promise<RefreshToken> {
    const token = new RefreshToken();

    token.user_id = user.id;
    token.is_revoked = false;

    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    token.expires = expiration;

    try {
      await token.save();
      return token;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findTokenById(user_id: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({ where: { user_id } });
  }
}
