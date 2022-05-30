import { Auth } from '../../auth/entity/auth.entity';
import { ApiProperty } from '@nestjs/swagger';

class Payload {
  @ApiProperty()
  type: string;
  @ApiProperty()
  token: string;
  @ApiProperty()
  refresh_token?: string;
}

export class AuthenticationPayload {
  @ApiProperty()
  user: Auth;

  @ApiProperty()
  payload: Payload;
}
