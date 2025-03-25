import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { ProjectsService } from 'src/projects/projects.service';
import { UsersService } from 'src/users/users.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { Project, ProjectSchema } from 'src/projects/schemas/project.schema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      // { name: Project.name, schema: ProjectSchema },
    ]),
    //   ProjectsModule,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    // ProjectsService
  ],
  exports: [TasksService],
})
export class TasksModule {}
