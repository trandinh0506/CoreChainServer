import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IUser } from './users.interface';
import mongoose from 'mongoose';
import { BlockchainService } from 'src/blockchain/blockchain.service';
export declare class UsersService {
    private userModel;
    private configService;
    private blockchainService;
    constructor(userModel: SoftDeleteModel<UserDocument>, configService: ConfigService, blockchainService: BlockchainService);
    getHashPassword: (password: string) => string;
    isValidPassword(password: string, hashPassword: string): boolean;
    getUserByToken: (refreshToken: string) => Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    updateUserToken: (refreshToken: string, _id: string) => Promise<mongoose.UpdateWriteOpResult>;
    findOneByUsername(username: string): mongoose.Query<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }, "findOne">;
    PRIVATE_FIELDS: string[];
    splitData(updateUserDto: UpdateUserDto): {
        employeeId: string;
        privateData: Record<string, any>;
        publicData: Record<string, any>;
    };
    create(createUserDto: CreateUserDto, user: IUser): Promise<{
        blockchainTxHash: string;
        name: string;
        email: string;
        password: string;
        role: string;
        workingHours: number;
        employeeId: string;
        personalIdentificationNumber: string;
        position: mongoose.Schema.Types.ObjectId;
        department: mongoose.Schema.Types.ObjectId;
        employeeContractId: mongoose.Schema.Types.ObjectId;
        startDate: Date;
        terminationDate: Date;
        personalTaxIdentificationNumber: string;
        socialInsuranceNumber: string;
        backAccountNumber: string;
    }>;
    findAll(currentPage: number, limit: number, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Omit<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }> & mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        } & Required<{
            _id: mongoose.Types.ObjectId;
        }>, never>[];
    }>;
    findOne(id: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    update(updateUserDto: UpdateUserDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
