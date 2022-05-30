import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  @Index({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  @Index({ unique: true })
  mobile: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: ['ADMIN', 'STAFF', 'SUPERADMIN'] })
  @Column()
  status: string;

  @ApiHideProperty()
  @Column()
  salt: string;

  @Column()
  @ApiProperty()
  @Index({ unique: true })
  email: string;
}
