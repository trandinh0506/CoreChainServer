import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { SecurityService } from 'src/security/security.service';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { IUser } from 'src/users/users.interface';
import { IFeedback } from './feedback.interface';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private encryptionService: SecurityService,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { category, title, content } = createFeedbackDto;
    const encryptedEmployeeId = this.encryptionService.encryptEmployeeId(
      createFeedbackDto.sender.toString(),
    );

    const newFeedback = this.feedbackRepository.create({
      encryptedEmployeeId,
      category,
      title,
      content,
      isFlagged: this.shouldFlagFeedback(createFeedbackDto.content),
    });
    
    const saved = await this.feedbackRepository.save(newFeedback);
    return saved._id;
  }
  
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
    if (!this.isValidId(feedbackId)) throw new BadRequestException(`Invalid feedback ID`);
    
    const feedback = await this.feedbackRepository.findOne({ where: { _id: feedbackId } });
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

    const decryptedId = this.encryptionService.decryptEmployeeId(
      feedback.encryptedEmployeeId,
      decryptRequest.secretKey,
    );
    if (decryptedId === null) {
      throw new BadRequestException('Incorrect secret key !');
    }

    feedback.wasDecrypted = true;
    feedback.decryptionReason = decryptRequest.reason;
    feedback.approvedBy = decryptRequest.approvedBy;
    feedback.decryptedBy = {
      _id: user._id,
      email: user.email,
    };
    
    await this.feedbackRepository.save(feedback);

    this.logger.warn(
      `Employee ID for feedback ${feedbackId} was decrypted by ${user.name}`,
    );

    return decryptedId;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.feedbackRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: { isDeleted: false },
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: result as unknown as IFeedback[],
    };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid feedback ID`);
    }
    return (await this.feedbackRepository.findOne({ where: { _id: id } })) as unknown as IFeedback;
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid feedback ID`);
    }
    const feedback = await this.feedbackRepository.findOne({ where: { _id: id } });
    if (!feedback) throw new BadRequestException(`Invalid feedback ID`);
    
    feedback.deletedBy = {
      _id: user._id,
      email: user.email,
    };
    feedback.isDeleted = true;
    feedback.deletedAt = new Date();
    await this.feedbackRepository.save(feedback);
    
    return this.feedbackRepository.softDelete({ _id: id });
  }
}
