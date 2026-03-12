import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto, @User() user: IUser) {
    return this.positionsService.create(createPositionDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.positionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
    @User() user: IUser,
  ) {
    return this.positionsService.update(id, updatePositionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.positionsService.remove(id, user);
  }
}
