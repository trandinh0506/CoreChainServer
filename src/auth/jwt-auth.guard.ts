import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorators/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private allowAccess = [
    'GET /api/v1/users/private/:id',
    'PATCH /api/v1/users/:id',
  ];
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  canAccess(req: Request, user, targetApi: string) {
    return (
      this.allowAccess.includes(targetApi) &&
      req.params.id === user._id.toString()
    );
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const isSkipPermission = this.reflector.getAllAndOverride<Boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token is absent or invalid');
    }

    // //check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path as string;
    const permissions = user?.permissions ?? [];
    console.log(permissions);
    console.log(targetMethod, targetEndpoint);

    let isExist = permissions.find(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === '/api/v1/' + permission.apiPath,
    );
    if (targetEndpoint.startsWith('/api/v1/auth')) isExist = true;

    // if (
    //   targetEndpoint === '/api/v1/users/private/:id' &&
    //   targetMethod === 'GET' &&
    //   !isExist
    // ) {
    //   if (request.params.id === user.employeeId.toString()) isExist = true;
    // }
    if (!isExist) {
      isExist = this.canAccess(
        request,
        user,
        targetMethod + ' ' + targetEndpoint,
      );
    }

    if (!isExist)
      throw new ForbiddenException(
        'You do not have permission to access this endpoint',
      );
    return user;
  }
}
