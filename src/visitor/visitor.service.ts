import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorEntity } from './visitor.entity';
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';
import { VisitorDto } from './dto/visitor.dto';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../common/enums/role.enum';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementWithStatusDto } from '../achievement/dto/achievement-with-status.dto';
import { AchievementUnlockResponseDto } from '../achievement/dto/achievement-unlock-response.dto';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
    @InjectRepository(AchievementUnlockLogEntity)
    private readonly achievementUnlockLogRepository: Repository<AchievementUnlockLogEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async authenticate(dto: VisitorDto): Promise<any> {
    const visitor = await this.findByEmail(dto.email);

    if (!visitor) {
      const created = await this.registerVisitor(dto);
      await this.issueVerification(created);
      return this.buildAuthResponse(created);
    }

    if (!this.checkNameMatch(visitor, dto)) {
      throw new UnauthorizedException(
        "Le prénom et le nom ne correspondent pas à l'adresse email renseignée.",
      );
    }

    if (!visitor.isVerified) {
      await this.issueVerification(visitor);
    }

    visitor.lastVisitAt = new Date();

    return this.buildAuthResponse(visitor);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const visitor = await this.visitorRepository.findOne({
      where: { verificationToken: token },
    });

    if (!visitor || visitor.isVerified) return false;
    if (visitor.verificationExpiresAt < new Date()) return false;

    visitor.isVerified = true;
    visitor.verificationToken = null;
    visitor.verificationExpiresAt = null;

    await this.visitorRepository.save(visitor);
    return true;
  }

  async refreshVisitorToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.type !== UserType.VISITOR) throw new UnauthorizedException();

      const accessToken = await this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          type: UserType.VISITOR,
        },
        {
          expiresIn: '15m',
          secret: this.config.get<string>('JWT_SECRET'),
        },
      );

      return { accessToken };
    } catch (err) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async getAchievementsForVisitor(
    visitorId: string,
  ): Promise<AchievementWithStatusDto[]> {
    const allAchievements = await this.achievementRepository.find();
    const visitor = await this.visitorRepository.findOne({
      where: { id: visitorId },
      relations: ['achievements'],
    });

    const unlocked = visitor.achievements.map((a) => a.id);
    return allAchievements.map((a) => ({
      ...a,
      unlocked: unlocked.includes(a.id),
    }));
  }

  async unlockAchievement(
    visitorId: string,
    code: string,
  ): Promise<AchievementUnlockResponseDto> {
    const visitor = await this.visitorRepository.findOne({
      where: { id: visitorId },
      relations: ['achievements'],
    });

    const achievement = await this.achievementRepository.findOne({
      where: { code },
    });

    if (!achievement) {
      throw new NotFoundException('Succès non trouvé.');
    }

    const alreadyUnlocked = visitor.achievements.find(
      (a) => a.id === achievement.id,
    );
    if (!alreadyUnlocked) {
      visitor.achievements.push(achievement);
      await this.visitorRepository.save(visitor);
      await this.achievementUnlockLogRepository.save({
        visitor,
        achievement,
      });
    }

    return {
      success: true,
      achievement,
    };
  }

  findAll(): Promise<VisitorEntity[]> {
    return this.visitorRepository.find();
  }

  private async findByEmail(email: string): Promise<VisitorEntity | null> {
    return this.visitorRepository.findOne({ where: { email } });
  }

  private checkNameMatch(visitor: VisitorEntity, dto: VisitorDto): boolean {
    return (
      visitor.firstName.trim().toLowerCase() ===
        dto.firstName.trim().toLowerCase() &&
      visitor.lastName.trim().toLowerCase() ===
        dto.lastName.trim().toLowerCase()
    );
  }

  private async registerVisitor(dto: VisitorDto): Promise<VisitorEntity> {
    const visitor = this.visitorRepository.create({
      ...dto,
      isVerified: false,
      verificationToken: randomUUID(),
      verificationExpiresAt: addDays(new Date(), 7),
      lastVisitAt: new Date(),
    });
    return this.visitorRepository.save(visitor);
  }

  private async issueVerification(visitor: VisitorEntity): Promise<void> {
    visitor.verificationToken = randomUUID();
    visitor.verificationExpiresAt = addDays(new Date(), 7);
    await this.visitorRepository.save(visitor);

    console.log(
      `🔗 Verification link: http://localhost:3000/visitor/verify?token=${visitor.verificationToken}`,
    );
  }

  private async issueJwt(visitor: VisitorEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: visitor.id,
        email: visitor.email,
        isVerified: visitor.isVerified,
        type: UserType.VISITOR,
      },
      {
        expiresIn: '15m',
        secret: this.config.get<string>('JWT_SECRET'),
      },
    );
  }

  private async issueRefreshJwt(visitor: VisitorEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: visitor.id,
        email: visitor.email,
        type: UserType.VISITOR,
      },
      {
        expiresIn: '7d',
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  private async buildAuthResponse(visitor: VisitorEntity) {
    const accessToken = await this.issueJwt(visitor);
    const refreshToken = await this.issueRefreshJwt(visitor);

    let message: string;
    if (!visitor.isVerified && visitor.verificationExpiresAt) {
      const msLeft = visitor.verificationExpiresAt.getTime() - Date.now();
      const daysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      message = `Merci de vérifier votre email. Ton compte sera supprimé dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} si tu ne le valides pas.`;
    }

    return {
      id: visitor.id,
      email: visitor.email,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      accessToken,
      refreshToken,
      isVerified: visitor.isVerified,
      lastVisitAt: visitor.lastVisitAt,
      ...(message ? { message } : {}),
    };
  }
}
