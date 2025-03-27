import {
  ArgumentsHost,
  Catch,
  createParamDecorator,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IS_PUBLIC_PERMISSION = 'isPublicPermission';
export const SkipCheckPermission = () =>
  SetMetadata(IS_PUBLIC_PERMISSION, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ADMIN_ROLE = 'ADMIN';
export const USER_ROLE = 'USER';
export const WORKING_HOURS_PER_DAY = 8;
export const START_OF_MONTH = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1,
);
export const END_OF_MONTH = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0,
  23,
  59,
  59,
  999,
);

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let message;
    if (exception instanceof HttpException) {
      message = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = 'Internal Server Error';
    }
    console.log(exception);
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
