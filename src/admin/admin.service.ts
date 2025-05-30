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
import { Admin } from './admin.entity/admin.entity';
import { UserType } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrects.');
    }
    return admin;
  }

  async login(dto: LoginAdminDto): Promise<{ access_token: string }> {
    const admin = await this.validateAdmin(dto.email, dto.password);

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: UserType.ADMIN,
    };

    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '1d';

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });

    return { access_token };
  }

  async createAdmin(dto: any) {
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
