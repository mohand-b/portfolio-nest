import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { randomUUID } from 'crypto';
import { addDays } from 'date-fns';
import { VisitorDto } from './dto/visitor.dto/visitor.dto';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../common/enums/role.enum';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
    private readonly jwtService: JwtService,
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

  private async findByEmail(email: string): Promise<Visitor | null> {
    return this.visitorRepository.findOne({ where: { email } });
  }

  private checkNameMatch(visitor: Visitor, dto: VisitorDto): boolean {
    return (
      visitor.firstName.trim().toLowerCase() ===
        dto.firstName.trim().toLowerCase() &&
      visitor.lastName.trim().toLowerCase() ===
        dto.lastName.trim().toLowerCase()
    );
  }

  private async registerVisitor(dto: VisitorDto): Promise<Visitor> {
    const visitor = this.visitorRepository.create({
      ...dto,
      isVerified: false,
      verificationToken: randomUUID(),
      verificationExpiresAt: addDays(new Date(), 7),
    });
    return this.visitorRepository.save(visitor);
  }

  private async issueVerification(visitor: Visitor): Promise<void> {
    visitor.verificationToken = randomUUID();
    visitor.verificationExpiresAt = addDays(new Date(), 7);
    await this.visitorRepository.save(visitor);

    console.log(
      `🔗 Verification link: http://localhost:3000/visitor/verify?token=${visitor.verificationToken}`,
    );
  }

  private async issueJwt(visitor: Visitor): Promise<string> {
    return this.jwtService.signAsync({
      sub: visitor.id,
      email: visitor.email,
      isVerified: visitor.isVerified,
      type: UserType.VISITOR,
    });
  }

  private async buildAuthResponse(visitor: Visitor) {
    const token = await this.issueJwt(visitor);

    let message: string;
    if (!visitor.isVerified && visitor.verificationExpiresAt) {
      const msLeft = visitor.verificationExpiresAt.getTime() - Date.now();
      const daysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
      message = `Merci de vérifier votre email. Votre compte sera supprimé dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''} si vous ne le validez pas.`;
    }

    return {
      access_token: token,
      isVerified: visitor.isVerified,
      ...(message ? { message } : {}),
    };
  }
}
