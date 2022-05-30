import { Module } from '@nestjs/common';
import { typeOrmConfig } from '../config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from './jwt/authentication.Module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
