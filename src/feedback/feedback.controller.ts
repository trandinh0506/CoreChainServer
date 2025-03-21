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
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorators/customize';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Post('decrypt/:id')
  trace(
    @Param('id') id: string,
    @Body() decryptRequest: DecryptRequestDto,
    @User() user: IUser,
  ) {
    return this.feedbackService.decryptEmployeeId(id, decryptRequest, user);
  }

  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.feedbackService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.feedbackService.remove(id, user);
  }
}
