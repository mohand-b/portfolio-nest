import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationEntity } from './certification.entity';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { EducationEntity } from '../education/education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificationEntity, EducationEntity])],
  controllers: [CertificationController],
  providers: [CertificationService],
  exports: [CertificationService],
})
export class CertificationModule {}
