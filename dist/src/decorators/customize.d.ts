import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const IS_PUBLIC_PERMISSION = "isPublicPermission";
export declare const SkipCheckPermission: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RESPONSE_MESSAGE = "response_message";
export declare class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
