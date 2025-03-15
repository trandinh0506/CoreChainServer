import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain/employees')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  async createEmployee(@Body() employeeData: any) {
    const { id, ...data } = employeeData;
    return this.blockchainService.createEmployee(id, data);
  }

  @Get(':id')
  async getEmployee(@Param('id') id: string) {
    return this.blockchainService.getEmployee(id);
  }

  @Patch(':id')
  async updateEmployee(@Param('id') id: string, @Body() employeeData: any) {
    return this.blockchainService.updateEmployee(id, employeeData);
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    return this.blockchainService.deleteEmployee(id);
  }

  @Get()
  async getAllEmployees() {
    return this.blockchainService.getAllEmployees();
  }

  @Post('query')
  async queryEmployees(@Body() query: any) {
    return this.blockchainService.queryEmployees(JSON.stringify(query));
  }
}
