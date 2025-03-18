import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: Array<string>;
    walletAddress: string;
    workingHours: number;
    feedback: Array<{
        email: string;
        content: string;
        createdAt: Date;
    }>;
    refreshToken: string;
    employeeId: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
}>;
