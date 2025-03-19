import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { EncryptionUntils } from 'src/security/encryptionUtils';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      // { name: Role.name, schema: RoleSchema },
    ]),
    BlockchainModule,
    EncryptionUntils,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
