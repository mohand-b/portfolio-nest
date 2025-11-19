import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { RejectQuestionDto } from './dto/reject-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';
import { QuestionPublicResponseDto } from './dto/question-public-response.dto';
import { JwtVisitorGuard } from '../core/guards/jwt-visitor.guard';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { AuthenticatedRequest } from '../core/types/request.types';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(JwtVisitorGuard)
  async create(
    @Body() dto: CreateQuestionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<QuestionResponseDto> {
    return this.questionService.create(dto, req.user.id);
  }

  @Get('public')
  async findAllPublic(): Promise<QuestionPublicResponseDto[]> {
    return this.questionService.findAllPublic();
  }

  @Get()
  @UseGuards(JwtAdminGuard)
  async findAll(): Promise<QuestionResponseDto[]> {
    return this.questionService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAdminGuard)
  async findOne(@Param('id') id: string): Promise<QuestionResponseDto> {
    return this.questionService.findOne(id);
  }

  @Patch(':id/answer')
  @UseGuards(JwtAdminGuard)
  async answer(
    @Param('id') id: string,
    @Body() dto: AnswerQuestionDto,
  ): Promise<QuestionResponseDto> {
    return this.questionService.answer(id, dto);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAdminGuard)
  async reject(
    @Param('id') id: string,
    @Body() dto: RejectQuestionDto,
  ): Promise<QuestionResponseDto> {
    return this.questionService.reject(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.questionService.delete(id);
  }
}
