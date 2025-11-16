import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationEntity } from './certification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificationEntity])],
})
export class CertificationModule {}
