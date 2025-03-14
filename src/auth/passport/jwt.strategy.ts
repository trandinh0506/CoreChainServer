import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;
    if (!role || typeof role !== 'object' || !role._id) {
      throw new Error('Invalid role data in JWT payload');
    }
    // const roleData = await this.rolesService.findOne(role._id);
    // const permissions = roleData ? (roleData.permissions ?? []) : [];
    return {
      _id,
      name,
      email,
      role,
      // permissions,
    };
  }
}
