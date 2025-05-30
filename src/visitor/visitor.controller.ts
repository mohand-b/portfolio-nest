import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorDto } from './dto/visitor.dto/visitor.dto';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async authenticate(@Body() dto: VisitorDto) {
    return this.visitorService.authenticate(dto);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    const success = await this.visitorService.verifyEmail(token);
    if (!success) throw new BadRequestException('Token invalide ou expiré.');
    return { message: 'Email vérifié avec succès.' };
  }
}
