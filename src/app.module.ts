import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VisitorController } from './visitor/visitor.controller';
import { VisitorService } from './visitor/visitor.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { TimelineController } from './timeline/timeline.controller';
import { TimelineService } from './timeline/timeline.service';
import { AchievementController } from './achievement/achievement.controller';
import { AchievementService } from './achievement/achievement.service';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';

@Module({
  imports: [],
  controllers: [AppController, VisitorController, AdminController, TimelineController, AchievementController, ContactController, QuestionController],
  providers: [AppService, VisitorService, AdminService, TimelineService, AchievementService, ContactService, QuestionService],
})
export class AppModule {}
