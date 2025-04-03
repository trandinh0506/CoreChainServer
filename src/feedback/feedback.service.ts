import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SecurityService } from 'src/security/security.service';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: SoftDeleteModel<FeedbackDocument>,
    private encryptionService: SecurityService,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { category, title, content } = createFeedbackDto;
    const encryptedEmployeeId = this.encryptionService.encryptEmployeeId(
      createFeedbackDto.sender.toString(),
    );

    const newFeedback = await this.feedbackModel.create({
      encryptedEmployeeId,
      category,
      title,
      content,
      isFlagged: this.shouldFlagFeedback(createFeedbackDto.content),
    });
    return newFeedback._id;
  }
  private shouldFlagFeedback(content: string): boolean {
    // Violence, Suicide, Abuse and exploitation, Sensitive and sexual, banned substances, Extremist and hateful language
    // prettier-ignore
    const flagWords = [
      'threat', 'illegal', 'violence', 'harassment', 'bomb', 'kill', 'attack', 'murder', 'assault', 'shoot',
      'stab', 'hijack', 'terrorist', 'explode', 'gun', 'rifle', 'pistol', 'knife', 'rape', 'abuse', 'robbery',
      'kidnap', 'hostage','arson','strangle','torture','execute', 'decapitate', 'suicide', 'self-harm','cutting',
      'overdose','hanging','jump', 'slit','poison','suffocate','die alone','depressed','no way out', 'pedophile',
      'molest','trafficking','prostitution','slave','incest','grooming','exploitation','child abuse','blackmail',
      'porn', 'nude','xxx','sex','explicit','hardcore','strip','escort','onlyfans','camgirl','fetish','bdsm',
      'bestiality','necrophilia',
      'cocaine', 'heroin','meth','drug','weed','marijuana','ecstasy','overdose','smuggle','cartel','narcotic',
      'racist', 'homophobic','hate crime','lynch','ethnic cleansing','nazi','white supremacy','genocide','discrimination',
    ];

    return flagWords.some((word) => content.toLowerCase().includes(word));
  }

  async decryptEmployeeId(
    feedbackId: string,
    decryptRequest: DecryptRequestDto,
    user: IUser,
  ): Promise<string> {
    const feedback = await this.feedbackModel.findById(feedbackId);
    if (!feedback) {
      throw new Error('Feedback not found');
    }

    if (!decryptRequest.reason || decryptRequest.reason.length < 10) {
      throw new ForbiddenException(
        'A detailed reason for decryption is required',
      );
    }

    if (!decryptRequest.approvedBy || decryptRequest.approvedBy.length === 0) {
      throw new ForbiddenException(
        'Decryption requires approval from a senior manager',
      );
    }

    // await this.auditLogService.logDecryptionAttempt({
    //   feedbackId,
    //   requestedBy: requestingUser,
    //   approvedBy: decryptRequest.approvedBy,
    //   reason: decryptRequest.reason,
    //   timestamp: new Date(),
    // });

    const decryptedId = this.encryptionService.decryptEmployeeId(
      feedback.encryptedEmployeeId,
      decryptRequest.secretKey,
    );
    if (decryptedId === null) {
      throw new BadRequestException('Incorrect secret key !');
    }

    await this.feedbackModel.updateOne(
      { feedbackId },
      {
        wasDecrypted: true,
        decryptionReason: decryptRequest.reason,
        approvedBy: decryptRequest.approvedBy,
        decryptedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    this.logger.warn(
      `Employee ID for feedback ${feedbackId} was decrypted by ${user.name}`,
    );

    return decryptedId;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.feedbackModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.feedbackModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid feedback ID`);
    }
    return this.feedbackModel.findById(id);
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid feedback ID`);
    }
    await this.feedbackModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.feedbackModel.softDelete({ _id: id });
  }
}
