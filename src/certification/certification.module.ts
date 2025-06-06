import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationEntity } from './certification.entity';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CertificationEntity])],
  controllers: [CertificationController],
  providers: [CertificationService],
  exports: [CertificationService],
})
export class CertificationModule {}
