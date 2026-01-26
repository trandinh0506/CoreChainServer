import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { ProjectsModule } from 'src/projects/projects.module';
import { Project, ProjectSchema } from 'src/projects/schemas/project.schema';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    forwardRef(() => NotificationModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    NotificationService
  ],
  exports: [TasksService],
})
export class TasksModule {}
