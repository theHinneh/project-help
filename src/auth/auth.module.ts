import { Global, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './repository/auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([AuthRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY },
    }),
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
