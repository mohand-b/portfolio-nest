import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), CoreModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
