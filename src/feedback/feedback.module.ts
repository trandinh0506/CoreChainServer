import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { SecurityService } from 'src/security/security.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, SecurityService],
})
export class FeedbackModule {}
