import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto/create-visitor.dto';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async create(@Body() dto: CreateVisitorDto) {
    return this.visitorService.createVisitor(dto);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    const success = await this.visitorService.verifyEmail(token);
    if (!success) throw new BadRequestException('Invalid or expired token');
    return { message: 'Email verified successfully.' };
  }
}
