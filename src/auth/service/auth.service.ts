import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../repository/auth.repository';
import { Auth } from '../entity/auth.entity';
import { LoginDto, SignUpDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository) private authRepository: AuthRepository,
  ) {}

  async signUp(authDto: SignUpDto): Promise<Auth> {
    const user = new Auth();
    user.email = authDto.email;
    user.username = authDto.username;
    user.status = authDto.status;
    user.mobile = authDto.mobile;
    user.salt = await bcrypt.genSalt();
    user.password = await AuthService.hashPassword(authDto.password, user.salt);
    const auth = await this.authRepository.signUp(user);
    delete auth.password;
    delete auth.salt;
    return auth;
  }

  async login(loginDto: LoginDto): Promise<Auth> {
    const { username, password } = loginDto;
    const user = await this.authRepository.findOne({ where: { username } });
    // console.log(loginDto);
    if (user && (await bcrypt.hash(password, user.salt)) === user.password) {
      delete user.password;
      delete user.salt;
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Username or Password is incorrect',
      });
    }
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async findById(id: string): Promise<Auth | null> {
    return await this.authRepository.findOne({ where: { id } });
  }

  async getAllAdmins(): Promise<Auth[]> {
    const staff = await this.authRepository.getAllAdmins();
    for (const user of staff) {
      delete user.password;
      delete user.salt;
    }
    return staff;
  }
}
