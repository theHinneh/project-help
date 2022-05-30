import { IsNotEmpty } from 'class-validator';
import { Auth } from '../../auth/entity/auth.entity';
import { AuthenticationPayload } from '../interface/authenticationPayload.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshRequest {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refresh_token: string;
}

export class RegisterResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  data: AuthenticationPayload;
}

export interface TokenPayload {
  user: Auth;
  payload: {
    type: 'bearer';
    token: string;
  };
}
