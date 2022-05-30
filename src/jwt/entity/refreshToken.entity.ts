import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  user_id: string;

  @ApiProperty()
  @Column()
  is_revoked: boolean;

  @ApiProperty()
  @Column()
  expires: Date;
}
