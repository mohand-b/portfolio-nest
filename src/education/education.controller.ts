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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { EducationEntity } from './education.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Body() dto: CreateEducationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<EducationEntity> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.educationService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<EducationEntity> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.educationService.update(id, dto);
  }

  @Get()
  async findAll(): Promise<EducationEntity[]> {
    return this.educationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EducationEntity> {
    return this.educationService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.educationService.delete(id);
    return { message: 'Education deleted successfully' };
  }

  @Delete('all')
  @UseGuards(JwtAdminGuard)
  async deleteAll(): Promise<{ message: string }> {
    await this.educationService.deleteAll();
    return { message: 'All education records deleted successfully' };
  }
}
