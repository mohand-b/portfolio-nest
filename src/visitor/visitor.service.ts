import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { randomUUID } from 'crypto';
import { CreateVisitorDto } from './dto/create-visitor.dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,
  ) {}

  async createVisitor(dto: CreateVisitorDto): Promise<{ message: string }> {
    const existing = await this.visitorRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('This email is already used');
    }

    const token = randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    const visitor = this.visitorRepository.create({
      ...dto,
      isVerified: false,
      verificationToken: token,
      verificationExpiresAt: expires,
    });

    await this.visitorRepository.save(visitor);

    return { message: 'Visitor created. Verification email sent.' };
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
}
