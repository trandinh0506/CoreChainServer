import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SecurityService } from 'src/security/security.service';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: SoftDeleteModel<FeedbackDocument>,
    private encryptionService: SecurityService,
  ) {}

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const { category, title, content } = createFeedbackDto;
    const encryptedEmployeeId = this.encryptionService.encryptEmployeeId(
      createFeedbackDto.sender.toString(),
    );

    return this.feedbackModel.create({
      encryptedEmployeeId,
      category,
      title,
      content,
      isFlagged: this.shouldFlagFeedback(createFeedbackDto.content),
    });
  }
  // prettier-ignore
  private shouldFlagFeedback(content: string): boolean {
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
    const feedback = await this.feedbackModel.findOne({
      where: { id: feedbackId },
    });
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
      throw new Error('Incorrect secret key !');
    }

    await this.feedbackModel.updateOne(
      { feedbackId },
      {
        wasDecrypted: true,
        decryptionReason: decryptRequest.reason,
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

  create(createFeedbackDto: CreateFeedbackDto) {
    return 'This action adds a new feedback';
  }

  trace(id: string) {}

  findAll() {
    return `This action returns all feedback`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
