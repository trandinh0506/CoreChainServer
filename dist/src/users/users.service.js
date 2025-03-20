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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const config_1 = require("@nestjs/config");
const bcryptjs_1 = require("bcryptjs");
const api_query_params_1 = __importDefault(require("api-query-params"));
const mongoose_2 = __importDefault(require("mongoose"));
const blockchain_service_1 = require("../blockchain/blockchain.service");
const security_service_1 = require("../security/security.service");
let UsersService = class UsersService {
    constructor(userModel, configService, blockchainService, securityService) {
        this.userModel = userModel;
        this.configService = configService;
        this.blockchainService = blockchainService;
        this.securityService = securityService;
        this.getHashPassword = (password) => {
            const salt = (0, bcryptjs_1.genSaltSync)(10);
            const hash = (0, bcryptjs_1.hashSync)(password, salt);
            return hash;
        };
        this.getUserByToken = async (refreshToken) => {
            try {
                return await this.userModel.findOne({ refreshToken });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.updateUserToken = async (refreshToken, _id) => {
            try {
                return await this.userModel
                    .updateOne({ _id }, {
                    refreshToken,
                })
                    .populate({
                    path: 'role',
                    select: { name: 1 },
                });
            }
            catch (error) {
                console.log(error);
            }
        };
        this.PRIVATE_FIELDS = [
            'personalIdentificationNumber',
            'position',
            'department',
            'employeeContractId',
            'startDate',
            'terminationDate',
            'personalTaxIdentificationNumber',
            'socialInsuranceNumber',
            'backAccountNumber',
        ];
    }
    isValidPassword(password, hashPassword) {
        return (0, bcryptjs_1.compareSync)(password, hashPassword);
    }
    findOneByUsername(username) {
        return this.userModel
            .findOne({
            email: username,
        })
            .populate({ path: 'role', select: { name: 1 } });
    }
    splitData(updateUserDto) {
        const publicData = {};
        const privateData = {};
        let employeeId;
        for (const [key, value] of Object.entries(updateUserDto)) {
            if (this.PRIVATE_FIELDS.includes(key)) {
                privateData[key] = value;
            }
            else {
                publicData[key] = value;
            }
            if (key === 'employeeId') {
                employeeId = value;
            }
        }
        return { employeeId, privateData, publicData };
    }
    async create(createUserDto, user) {
        try {
            const { name, email, password, role } = createUserDto;
            const isExist = await this.userModel.findOne({ email });
            if (isExist) {
                throw new common_1.BadRequestException('Email already exist. Please use another email');
            }
            const hashPassword = this.getHashPassword(password);
            let newUser = await this.userModel.create({
                name,
                email,
                password: hashPassword,
                employeeId: createUserDto.employeeId,
                createdBy: {
                    _id: user._id,
                    email: user.email,
                },
            });
            const employeeData = {
                employeeId: createUserDto.employeeId,
                encryptedData: this.securityService.encrypt({
                    personalIdentificationNumber: createUserDto.personalIdentificationNumber,
                    position: createUserDto.position,
                    department: createUserDto.department,
                    employeeContractId: createUserDto.employeeContractId,
                    startDate: createUserDto.startDate,
                    terminationDate: createUserDto.terminationDate,
                    personalTaxIdentificationNumber: createUserDto.personalTaxIdentificationNumber,
                    socialInsuranceNumber: createUserDto.socialInsuranceNumber,
                    backAccountNumber: createUserDto.backAccountNumber,
                }),
            };
            console.log(employeeData);
            try {
                const txHash = await this.blockchainService.addEmployee(employeeData);
                console.log(txHash);
                return {
                    ...createUserDto,
                    blockchainTxHash: txHash,
                };
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(currentPage, limit, qs) {
        const { filter, skip, sort, projection, population } = (0, api_query_params_1.default)(qs);
        delete filter.current;
        delete filter.pageSize;
        filter.isDeleted = false;
        let offset = (+currentPage - 1) * +limit;
        let defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.userModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.userModel
            .find(filter)
            .select('-password')
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort)
            .populate(population)
            .exec();
        const employees = await this.blockchainService.getAllEmployeeIds();
        console.log(employees);
        return {
            meta: {
                current: currentPage,
                pageSize: limit,
                pages: totalPages,
                total: totalItems,
            },
            result,
        };
    }
    async findOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Not found user with id=${id}`);
        }
        return await this.userModel
            .findOne({
            _id: id,
            isDeleted: false,
        })
            .select('-password -refreshToken')
            .populate({ path: 'role', select: { name: 1, _id: 1 } });
    }
    async findPrivateOne(id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Not found user with id=${id}`);
        }
        const publicEmployee = await this.userModel
            .findById(id)
            .select('-password -refreshToken')
            .populate({ path: 'role', select: { name: 1, _id: 1 } })
            .lean();
        const privateEmployee = await this.blockchainService.getEmployee(publicEmployee.employeeId);
        return {
            ...publicEmployee,
            ...privateEmployee,
        };
    }
    async update(updateUserDto, user, id) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Not found user with id=${id}`);
        }
        const idExist = await this.userModel.findOne({
            _id: id,
        });
        if (!idExist)
            throw new common_1.BadRequestException('User not found !');
        const { employeeId, privateData, publicData } = this.splitData(updateUserDto);
        if (Object.keys(privateData).length !== 0) {
            if (!employeeId) {
                throw new common_1.BadRequestException('Can not update. Must have employee ID !');
            }
            const updateData = {
                employeeId: employeeId,
                encryptedData: this.securityService.encrypt(privateData),
            };
            try {
                const txHash = await this.blockchainService.updateEmployee(updateData);
                console.log(txHash);
            }
            catch (error) {
                throw error;
            }
        }
        return await this.userModel.updateOne({
            _id: id,
        }, {
            ...publicData,
            updatedBy: {
                _id: user._id,
                email: user.email,
            },
        });
    }
    async remove(id, user) {
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Not found user with id=${id}`);
        }
        const foundUser = await this.userModel.findById(id);
        const ADMIN_EMAIL = this.configService.get('ADMIN_EMAIL');
        if (foundUser && foundUser.email === ADMIN_EMAIL)
            throw new common_1.BadRequestException('Cannot delete admin account !');
        await this.userModel.updateOne({ _id: id }, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        const employee = await this.userModel
            .findOne({ _id: id })
            .select('employeeId');
        console.log(employee);
        await this.blockchainService.deactivateEmployee(employee.employeeId);
        return this.userModel.softDelete({
            _id: id,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService,
        blockchain_service_1.BlockchainService,
        security_service_1.SecurityService])
], UsersService);
//# sourceMappingURL=users.service.js.map