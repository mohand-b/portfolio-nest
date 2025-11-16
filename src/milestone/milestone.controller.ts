import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestoneResponseDto } from './dto/milestone-response.dto';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('milestones')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Body() dto: CreateMilestoneDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MilestoneResponseDto> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.milestoneService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMilestoneDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MilestoneResponseDto> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.milestoneService.update(id, dto);
  }

  @Get()
  async findAll(): Promise<MilestoneResponseDto[]> {
    return this.milestoneService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MilestoneResponseDto> {
    return this.milestoneService.findOne(id);
  }

  @UseGuards(JwtAdminGuard)
  @Delete('all')
  async deleteAll(): Promise<{ message: string }> {
    await this.milestoneService.deleteAll();
    return { message: 'All milestones deleted successfully' };
  }

  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.milestoneService.delete(id);
    return { message: 'Milestone deleted successfully' };
  }
}
