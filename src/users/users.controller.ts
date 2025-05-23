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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdatePassword,
  UpdatePublicUserDto,
  UpdateUserDto,
  UpdateWorkingHoursDto,
} from './dto/update-user.dto';
import { Public, User } from 'src/decorators/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/private/:id')
  findPrivateOne(@Param('id') id: string) {
    return this.usersService.findPrivateOne(id);
  }

  @Patch(':id')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.usersService.update(updateUserDto, user, id);
  }

  @Patch('public/:id')
  updatePublic(
    @Body() updatePublicUserDto: UpdatePublicUserDto,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.usersService.updatePublicUser(updatePublicUserDto, user, id);
  }

  @Patch('working/id')
  updateWorkingHours(
    @Body() updateWorkingHoursDto: UpdateWorkingHoursDto,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.usersService.updateWorkingHours(
      updateWorkingHoursDto,
      user,
      id,
    );
  }

  @Post('password/change')
  changePass(@Body() updatePassword: UpdatePassword, @User() user: IUser) {
    return this.usersService.changePassword(updatePassword, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
