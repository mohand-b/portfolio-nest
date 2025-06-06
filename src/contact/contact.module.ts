import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { ContactMessageEntity } from './contact-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessageEntity])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
