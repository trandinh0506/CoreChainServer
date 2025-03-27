import { Module } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { UsersModule } from 'src/users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SalaryAdvance,
  SalaryAdvanceSchema,
} from './schemas/salary-advance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalaryAdvance.name, schema: SalaryAdvanceSchema },
    ]),
    UsersModule,
    TasksModule,
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService],
})
export class PersonnelModule {}
