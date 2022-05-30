import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profile/entity/profile.entity';

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

  @ApiProperty({ enum: ['ADMIN', 'STAFF', 'SUPER_ADMIN'] })
  @Column()
  status: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN';

  @ApiHideProperty()
  @Column()
  salt: string;

  @Column()
  @ApiProperty()
  @Index({ unique: true })
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
