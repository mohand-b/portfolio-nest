import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VisitorController } from './visitor/visitor.controller';
import { VisitorService } from './visitor/visitor.service';
import { Visitor } from './visitor/visitor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Visitor],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Visitor]),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
})
export class AppModule {}
