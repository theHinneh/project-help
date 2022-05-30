import { Global, Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { AuthenticationController } from './controller/athentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshToken } from './entity/refreshToken.entity';

@Global()
@Module({
  providers: [TokenService, JwtStrategy],
  controllers: [AuthenticationController],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'theNsawamRoadApi',
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  exports: [JwtStrategy],
})
export class AuthenticationModule {}
