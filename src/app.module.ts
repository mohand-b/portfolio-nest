import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/core.module';
import { AdminModule } from './admin/admin.module';
import { VisitorModule } from './visitor/visitor.module';
import { CertificationModule } from './certification/certification.module';
import { JobModule } from './job/job.module';
import { ProjectModule } from './project/project.module';
import { SkillModule } from './skill/skill.module';
import { TimelineModule } from './timeline/timeline.module';
import { AchievementModule } from './achievement/achievement.module';
import { ContactModule } from './contact/contact.module';
import { QuestionModule } from './question/question.module';
import { AchievementUnlockLogModule } from './achievement-unlock-log/achievement-unlock-log.module';

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
    CoreModule,
    AdminModule,
    VisitorModule,
    CertificationModule,
    JobModule,
    ProjectModule,
    SkillModule,
    TimelineModule,
    AchievementModule,
    ContactModule,
    QuestionModule,
    AchievementUnlockLogModule,
  ],
})
export class AppModule {}
