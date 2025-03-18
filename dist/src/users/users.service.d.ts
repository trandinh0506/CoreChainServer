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
    findPrivateOne(id: string): Promise<{
        employeeId: string;
        encryptedData: string;
        timestamp?: number;
        isActive?: boolean;
        _id: mongoose.Types.ObjectId;
        __v?: any;
        $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }, keyof Paths> & Paths;
        $clone: () => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        $getAllSubdocs: () => mongoose.Document[];
        $ignore: (path: string) => void;
        $isDefault: (path: string) => boolean;
        $isDeleted: (val?: boolean) => boolean;
        $getPopulatedDocs: () => mongoose.Document[];
        $inc: (path: string | string[], val?: number) => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        $isEmpty: (path: string) => boolean;
        $isValid: (path: string) => boolean;
        $locals: mongoose.FlattenMaps<Record<string, unknown>>;
        $markValid: (path: string) => void;
        $model: {
            <ModelType = mongoose.Model<unknown, {}, {}, {}, mongoose.Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            }, any>>(): ModelType;
        };
        $op: "save" | "validate" | "remove" | null;
        $session: (session?: mongoose.ClientSession | null) => mongoose.ClientSession | null;
        $set: {
            (path: string | Record<string, any>, val: any, type: any, options?: mongoose.DocumentSetOptions): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, options?: mongoose.DocumentSetOptions): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
            (value: string | Record<string, any>): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
        };
        $where: mongoose.FlattenMaps<Record<string, unknown>>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.FlattenMaps<mongoose.Connection>;
        deleteOne: (options?: mongoose.QueryOptions) => Promise<mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }>;
        depopulate: (path?: string | string[]) => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        directModifiedPaths: () => Array<string>;
        equals: (doc: mongoose.Document<unknown, any, any>) => boolean;
        errors?: mongoose.Error.ValidationError;
        get: {
            <T extends keyof User>(path: T, type?: any, options?: any): User[T];
            (path: string, type?: any, options?: any): any;
        };
        getChanges: () => mongoose.UpdateQuery<mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }>;
        id?: any;
        increment: () => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        init: (obj: mongoose.AnyObject, opts?: mongoose.AnyObject) => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        invalidate: {
            <T extends keyof User>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
        };
        isDirectModified: {
            <T extends keyof User>(path: T | T[]): boolean;
            (path: string | Array<string>): boolean;
        };
        isDirectSelected: {
            <T extends keyof User>(path: T): boolean;
            (path: string): boolean;
        };
        isInit: {
            <T extends keyof User>(path: T): boolean;
            (path: string): boolean;
        };
        isModified: {
            <T extends keyof User>(path?: T | T[], options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
            (path?: string | Array<string>, options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
        };
        isNew: boolean;
        isSelected: {
            <T extends keyof User>(path: T): boolean;
            (path: string): boolean;
        };
        markModified: {
            <T extends keyof User>(path: T, scope?: any): void;
            (path: string, scope?: any): void;
        };
        model: {
            <ModelType = mongoose.Model<unknown, {}, {}, {}, mongoose.Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            }, any>>(): ModelType;
        };
        modifiedPaths: (options?: {
            includeChildren?: boolean;
        }) => Array<string>;
        overwrite: (obj: mongoose.AnyObject) => mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        };
        $parent: () => mongoose.Document | undefined;
        populate: {
            <Paths = {}>(path: string | mongoose.PopulateOptions | (string | mongoose.PopulateOptions)[]): Promise<mongoose.MergeType<mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            }, Paths>>;
            <Paths = {}>(path: string, select?: string | mongoose.AnyObject, model?: mongoose.Model<any>, match?: mongoose.AnyObject, options?: mongoose.PopulateOptions): Promise<mongoose.MergeType<mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            }, Paths>>;
        };
        populated: (path: string) => any;
        replaceOne: (replacement?: mongoose.AnyObject, options?: mongoose.QueryOptions | null) => mongoose.Query<any, mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }, {}, mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }, "find">;
        save: (options?: mongoose.SaveOptions) => Promise<mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }>;
        schema: mongoose.FlattenMaps<mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
            [x: string]: any;
        }, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
            [x: string]: any;
        }>> & mongoose.FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>>>;
        set: {
            <T extends keyof User>(path: T, val: User[T], type: any, options?: mongoose.DocumentSetOptions): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, type: any, options?: mongoose.DocumentSetOptions): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, options?: mongoose.DocumentSetOptions): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
            (value: string | Record<string, any>): mongoose.Document<unknown, {}, User> & User & {
                _id: mongoose.Types.ObjectId;
            };
        };
        toJSON: {
            <T = User & {
                _id: mongoose.Types.ObjectId;
            }>(options?: mongoose.ToObjectOptions & {
                flattenMaps?: true;
            }): mongoose.FlattenMaps<T>;
            <T = User & {
                _id: mongoose.Types.ObjectId;
            }>(options: mongoose.ToObjectOptions & {
                flattenMaps: false;
            }): T;
        };
        toObject: <T = User & {
            _id: mongoose.Types.ObjectId;
        }>(options?: mongoose.ToObjectOptions) => mongoose.Require_id<T>;
        unmarkModified: {
            <T extends keyof User>(path: T): void;
            (path: string): void;
        };
        updateOne: (update?: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }>, options?: mongoose.QueryOptions | null) => mongoose.Query<any, mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }, {}, mongoose.Document<unknown, {}, User> & User & {
            _id: mongoose.Types.ObjectId;
        }, "find">;
        validate: {
            <T extends keyof User>(pathsToValidate?: T | T[], options?: mongoose.AnyObject): Promise<void>;
            (pathsToValidate?: mongoose.pathsToValidate, options?: mongoose.AnyObject): Promise<void>;
            (options: {
                pathsToSkip?: mongoose.pathsToSkip;
            }): Promise<void>;
        };
        validateSync: {
            (options: {
                pathsToSkip?: mongoose.pathsToSkip;
                [k: string]: any;
            }): mongoose.Error.ValidationError | null;
            <T extends keyof User>(pathsToValidate?: T | T[], options?: mongoose.AnyObject): mongoose.Error.ValidationError | null;
            (pathsToValidate?: mongoose.pathsToValidate, options?: mongoose.AnyObject): mongoose.Error.ValidationError | null;
        };
        name: string;
        email: string;
        password: string;
        role: string;
        permissions: Array<string>;
        walletAddress: string;
        workingHours: number;
        feedback: mongoose.FlattenMaps<{
            email: string;
            content: string;
            createdAt: Date;
        }>[];
        refreshToken: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        createdBy: mongoose.FlattenMaps<{
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }>;
        updatedBy: mongoose.FlattenMaps<{
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }>;
        deletedBy: mongoose.FlattenMaps<{
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }>;
    }>;
    update(updateUserDto: UpdateUserDto, user: IUser, id: string): Promise<mongoose.UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
