import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        affiliate: true,
      },
    });
    if (user && password === user.password) {
      return user;
    }
    return null;
  }

  async login(dto: LoginDto) {
    console.log('loggin dto', dto);
    const { email, password } = dto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
