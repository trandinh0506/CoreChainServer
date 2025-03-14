"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ms_1 = __importDefault(require("ms"));
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.createRefreshToken = (payload) => {
            const refresh_token = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')) / 1000,
            });
            return refresh_token;
        };
        this.processNewToken = async (refreshToken, response) => {
            try {
                console.log(refreshToken);
                this.jwtService.verify(refreshToken, {
                    secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                });
                let user = await this.usersService.getUserByToken(refreshToken);
                if (user) {
                    const { _id, name, email, role } = user;
                    const payload = {
                        sub: 'token refresh',
                        iss: 'from server',
                        _id,
                        name,
                        email,
                        role,
                    };
                    const refresh_token = this.createRefreshToken(payload);
                    await this.usersService.updateUserToken(refresh_token, _id.toString());
                    const userRole = user.role;
                    response.clearCookie('refresh_token');
                    response.cookie('refresh_token', refresh_token, {
                        httpOnly: true,
                        maxAge: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')),
                    });
                    return {
                        access_token: this.jwtService.sign(payload),
                        user: {
                            _id,
                            name,
                            email,
                            role,
                        },
                    };
                }
                else {
                    throw new common_1.BadRequestException('Refresh token is invalid. Please login');
                }
            }
            catch (error) {
                throw new common_1.BadRequestException('Refresh token is invalid. Please login');
            }
        };
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role;
                const objUser = {
                    ...user.toObject(),
                };
                return objUser;
            }
        }
        return null;
    }
    async login(user, response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            name,
            email,
            role,
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: (0, ms_1.default)(this.configService.get('JWT_REFRESH_EXPIRE')),
        });
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions,
            },
        };
    }
    async logout(response, user) {
        try {
            await this.usersService.updateUserToken('', user._id);
            response.clearCookie('refresh_token');
            return 'ok';
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map