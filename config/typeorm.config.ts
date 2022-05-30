import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgress',
  port: 5432,
  database: 'emmanuella',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
