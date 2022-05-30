import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Auth } from '../../auth/entity/auth.entity';

@Entity()
export class Profile extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column('json')
  interests: string[];

  @ApiProperty()
  @Column()
  location: string;

  @OneToOne(() => Auth, (user) => user.profile, { eager: true })
  @JoinColumn()
  user: Auth;
}
