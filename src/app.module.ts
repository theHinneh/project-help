import { Module } from '@nestjs/common';
import { typeOrmConfig } from '../config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from './jwt/authentication.Module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    AuthenticationModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
