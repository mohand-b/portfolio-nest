import { Injectable } from '@nestjs/common';
import { AchievementEntity } from './achievement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(AchievementEntity)
    private achievementRepository: Repository<AchievementEntity>,
  ) {}

  async create(dto: CreateAchievementDto): Promise<AchievementEntity> {
    const achievement = this.achievementRepository.create(dto);
    return this.achievementRepository.save(achievement);
  }

  findAll(): Promise<AchievementEntity[]> {
    return this.achievementRepository.find();
  }
}
