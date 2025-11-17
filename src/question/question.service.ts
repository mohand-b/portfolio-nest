import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { RejectQuestionDto } from './dto/reject-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';
import { QuestionPublicResponseDto } from './dto/question-public-response.dto';
import { QuestionStatusEnum } from '../common/enums/question-status.enum';
import { plainToInstance } from 'class-transformer';
import { VisitorEntity } from '../visitor/visitor.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async create(
    dto: CreateQuestionDto,
    visitor?: VisitorEntity,
  ): Promise<QuestionResponseDto> {
    const question = this.questionRepository.create({
      content: dto.content,
      isAnonymous: dto.isAnonymous || false,
      visitor: dto.isAnonymous ? null : visitor,
      status: QuestionStatusEnum.PENDING,
    });

    const saved = await this.questionRepository.save(question);
    const withRelations = await this.questionRepository.findOne({
      where: { id: saved.id },
      relations: ['visitor'],
    });

    return plainToInstance(QuestionResponseDto, withRelations, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<QuestionResponseDto[]> {
    const questions = await this.questionRepository.find({
      relations: ['visitor'],
      order: { createdAt: 'DESC' },
    });

    return questions.map((q) =>
      plainToInstance(QuestionResponseDto, q, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findAllPublic(): Promise<QuestionPublicResponseDto[]> {
    const questions = await this.questionRepository.find({
      where: { status: QuestionStatusEnum.ANSWERED },
      relations: ['visitor'],
      order: { createdAt: 'DESC' },
    });

    return questions.map((q) =>
      plainToInstance(QuestionPublicResponseDto, q, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: string): Promise<QuestionResponseDto> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['visitor'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return plainToInstance(QuestionResponseDto, question, {
      excludeExtraneousValues: true,
    });
  }

  async answer(
    id: string,
    dto: AnswerQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['visitor'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    question.answer = dto.answer;
    question.status = QuestionStatusEnum.ANSWERED;
    question.rejectionReason = null;

    const saved = await this.questionRepository.save(question);

    return plainToInstance(QuestionResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async reject(
    id: string,
    dto: RejectQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['visitor'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    question.rejectionReason = dto.rejectionReason;
    question.status = QuestionStatusEnum.REJECTED;
    question.answer = null;

    const saved = await this.questionRepository.save(question);

    return plainToInstance(QuestionResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    await this.questionRepository
      .createQueryBuilder()
      .delete()
      .from(QuestionEntity)
      .execute();
  }
}
