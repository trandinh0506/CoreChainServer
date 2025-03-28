import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { UsersModule } from 'src/users/users.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { PositionsModule } from 'src/positions/positions.module';
import { PersonnelModule } from 'src/personnel/personnel.module';

@Module({
  imports: [UsersModule, DepartmentsModule, PositionsModule, PersonnelModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
