import { Status } from '../../jwt/jwt.strategy';

export class SignUpDto {
  username: string;
  password: string;
  email: string;
  mobile: string;
  status: Status;
}

export class LoginDto {
  username: string;
  password: string;
}
