import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { TokenService } from '../service/token.service';
import { LoginDto, SignUpDto } from '../../auth/dto/auth.dto';
import { RegisterResponse } from '../dto/refreshRequest.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokens: TokenService,
  ) {}

  @Post('/register')
  public async register(@Body() body: SignUpDto): Promise<RegisterResponse> {
    const user = await this.authService.signUp(body);
    const token = await this.tokens.generateAccessToken(user);

    const payload = this.tokens.buildResponsePayload(user, token);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('/login')
  async login(@Body() body: LoginDto): Promise<RegisterResponse> {
    const user = await this.authService.login(body);
    const token = await this.tokens.generateAccessToken(user);
    const payload = this.tokens.buildResponsePayload(user, token);
    return {
      status: 'success',
      data: payload,
    };
  }
}
