import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { VisitorEntity } from '../visitor/visitor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, VisitorEntity])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
