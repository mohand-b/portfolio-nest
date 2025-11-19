import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAdminDto } from './dto/login-admin.dto/login-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from './admin.entity';
import { UserType } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrects.');
    }
    return admin;
  }

  async login(
    dto: LoginAdminDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const admin = await this.validateAdmin(dto.email, dto.password);

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: UserType.ADMIN,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }

  async refreshAdminToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const accessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
        },
        {
          expiresIn: '15m',
          secret: this.config.get<string>('JWT_SECRET'),
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    const exists = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (exists)
      throw new ConflictException(
        'Cet email est déjà utilisé par un administrateur.',
      );

    const hash = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepository.create({
      email: dto.email,
      password: hash,
    });
    await this.adminRepository.save(admin);
    return { message: 'Admin créé', email: dto.email };
  }
}
