import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationEntity } from './education.entity';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EducationEntity])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
