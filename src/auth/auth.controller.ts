import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-auth.guard';
import { Public, User } from 'src/decorators/customize';
// import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
// import { RolesService } from 'src/roles/roles.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private roleService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalStrategy)
  @Post('/login')
  @UseGuards(ThrottlerGuard)
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    // const temp = (await this.roleService.findOne(user.role._id)) as any;
    // user.permissions = temp.permissions;
    return { user };
  }

  @Public()
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token, response);
  }

  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    try {
      console.log(user);
      return this.authService.logout(response, user);
    } catch (error) {
      console.log(error);
    }
  }
}
