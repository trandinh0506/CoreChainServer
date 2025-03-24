import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { EmployeeBlockchainData } from './interfaces/employee.interface';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('employee')
  async addEmployee(@Body() employeeData: any, @Body() employeeId: string) {
    const txHash = await this.blockchainService.addEmployee(
      employeeData,
      employeeId,
    );
    return { success: true, transactionHash: txHash };
  }

  @Put('employee')
  async updateEmployee(@Body() employeeData: EmployeeBlockchainData) {
    const txHash = await this.blockchainService.updateEmployee(employeeData);
    return { success: true, transactionHash: txHash };
  }

  @Delete('employee/:id')
  async deactivateEmployee(@Param('id') employeeId: string) {
    const txHash = await this.blockchainService.deactivateEmployee(employeeId);
    return { success: true, transactionHash: txHash };
  }

  @Get('employee/:id')
  async getEmployee(@Param('id') employeeId: string) {
    return await this.blockchainService.getEmployee(employeeId);
  }

  @Get('employees')
  async getAllEmployeeIds() {
    return await this.blockchainService.getAllEmployeeIds();
  }
}
