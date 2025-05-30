import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { VisitorController } from './visitor/visitor.controller';
import { VisitorService } from './visitor/visitor.service';
import { Visitor } from './visitor/visitor.entity';
import { Admin } from './admin/admin.entity/admin.entity';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Admin, Visitor]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('ADMIN_JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],
  controllers: [AdminController, VisitorController],
  providers: [AdminService, VisitorService],
})
export class AppModule {}
