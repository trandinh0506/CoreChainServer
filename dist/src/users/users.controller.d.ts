import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, user: IUser): Promise<{
        blockchainTxHash: string;
        name: string;
        email: string;
        password: string;
        role: string;
        workingHours: number;
        employeeId: string;
        personalIdentificationNumber: string;
        position: import("mongoose").Schema.Types.ObjectId;
        department: import("mongoose").Schema.Types.ObjectId;
        employeeContractId: import("mongoose").Schema.Types.ObjectId;
        startDate: Date;
        terminationDate: Date;
        personalTaxIdentificationNumber: string;
        socialInsuranceNumber: string;
        backAccountNumber: string;
    }>;
    findAll(currentPage: string, limit: string, qs: string): Promise<{
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        };
        result: Omit<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }> & import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>, never>[];
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findPrivateOne(id: string): Promise<{
        employeeId: string;
        encryptedData: string;
        timestamp?: number;
        isActive?: boolean;
        _id: import("mongoose").Types.ObjectId;
        __v?: any;
        $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }, keyof Paths> & Paths;
        $clone: () => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        $getAllSubdocs: () => import("mongoose").Document[];
        $ignore: (path: string) => void;
        $isDefault: (path: string) => boolean;
        $isDeleted: (val?: boolean) => boolean;
        $getPopulatedDocs: () => import("mongoose").Document[];
        $inc: (path: string | string[], val?: number) => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        $isEmpty: (path: string) => boolean;
        $isValid: (path: string) => boolean;
        $locals: import("mongoose").FlattenMaps<Record<string, unknown>>;
        $markValid: (path: string) => void;
        $model: {
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<import("./schemas/user.schema").User, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }, any>>(): ModelType;
        };
        $op: "save" | "validate" | "remove" | null;
        $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
        $set: {
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
            (value: string | Record<string, any>): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
        };
        $where: import("mongoose").FlattenMaps<Record<string, unknown>>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").FlattenMaps<import("mongoose").Connection>;
        deleteOne: (options?: import("mongoose").QueryOptions) => Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        depopulate: (path?: string | string[]) => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        directModifiedPaths: () => Array<string>;
        equals: (doc: import("mongoose").Document<unknown, any, any>) => boolean;
        errors?: import("mongoose").Error.ValidationError;
        get: {
            <T extends keyof import("./schemas/user.schema").User>(path: T, type?: any, options?: any): import("./schemas/user.schema").User[T];
            (path: string, type?: any, options?: any): any;
        };
        getChanges: () => import("mongoose").UpdateQuery<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        id?: any;
        increment: () => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        invalidate: {
            <T extends keyof import("./schemas/user.schema").User>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
        };
        isDirectModified: {
            <T extends keyof import("./schemas/user.schema").User>(path: T | T[]): boolean;
            (path: string | Array<string>): boolean;
        };
        isDirectSelected: {
            <T extends keyof import("./schemas/user.schema").User>(path: T): boolean;
            (path: string): boolean;
        };
        isInit: {
            <T extends keyof import("./schemas/user.schema").User>(path: T): boolean;
            (path: string): boolean;
        };
        isModified: {
            <T extends keyof import("./schemas/user.schema").User>(path?: T | T[], options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
            (path?: string | Array<string>, options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
        };
        isNew: boolean;
        isSelected: {
            <T extends keyof import("./schemas/user.schema").User>(path: T): boolean;
            (path: string): boolean;
        };
        markModified: {
            <T extends keyof import("./schemas/user.schema").User>(path: T, scope?: any): void;
            (path: string, scope?: any): void;
        };
        model: {
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<import("./schemas/user.schema").User, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }, any>>(): ModelType;
        };
        modifiedPaths: (options?: {
            includeChildren?: boolean;
        }) => Array<string>;
        overwrite: (obj: import("mongoose").AnyObject) => import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        $parent: () => import("mongoose").Document | undefined;
        populate: {
            <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }, Paths>>;
            <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }, Paths>>;
        };
        populated: (path: string) => any;
        replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }, "find">;
        save: (options?: import("mongoose").SaveOptions) => Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        schema: import("mongoose").FlattenMaps<import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: string]: any;
        }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            [x: string]: any;
        }>> & import("mongoose").FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>>>;
        set: {
            <T extends keyof import("./schemas/user.schema").User>(path: T, val: import("./schemas/user.schema").User[T], type: any, options?: import("mongoose").DocumentSetOptions): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
            (value: string | Record<string, any>): import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            };
        };
        toJSON: {
            <T = import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }>(options?: import("mongoose").ToObjectOptions & {
                flattenMaps?: true;
            }): import("mongoose").FlattenMaps<T>;
            <T = import("./schemas/user.schema").User & {
                _id: import("mongoose").Types.ObjectId;
            }>(options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
            }): T;
        };
        toObject: <T = import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }>(options?: import("mongoose").ToObjectOptions) => import("mongoose").Require_id<T>;
        unmarkModified: {
            <T extends keyof import("./schemas/user.schema").User>(path: T): void;
            (path: string): void;
        };
        updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }, {}, import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        }, "find">;
        validate: {
            <T extends keyof import("./schemas/user.schema").User>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
            }): Promise<void>;
        };
        validateSync: {
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
                [k: string]: any;
            }): import("mongoose").Error.ValidationError | null;
            <T extends keyof import("./schemas/user.schema").User>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
        };
        name: string;
        email: string;
        password: string;
        role: string;
        permissions: Array<string>;
        walletAddress: string;
        workingHours: number;
        feedback: import("mongoose").FlattenMaps<{
            email: string;
            content: string;
            createdAt: Date;
        }>[];
        refreshToken: string;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        createdBy: import("mongoose").FlattenMaps<{
            _id: import("mongoose").Schema.Types.ObjectId;
            email: string;
        }>;
        updatedBy: import("mongoose").FlattenMaps<{
            _id: import("mongoose").Schema.Types.ObjectId;
            email: string;
        }>;
        deletedBy: import("mongoose").FlattenMaps<{
            _id: import("mongoose").Schema.Types.ObjectId;
            email: string;
        }>;
    }>;
    update(updateUserDto: UpdateUserDto, id: string, user: IUser): Promise<import("mongoose").UpdateWriteOpResult>;
    remove(id: string, user: IUser): Promise<{
        deleted: number;
    }>;
}
