import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationEntity } from './education.entity';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { CertificationEntity } from '../certification/certification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationEntity, CertificationEntity])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
