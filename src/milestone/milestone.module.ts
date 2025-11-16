import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestoneEntity } from './milestone.entity';
import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneEntity])],
  controllers: [MilestoneController],
  providers: [MilestoneService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
