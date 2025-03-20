import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { BlockchainProvider } from './blockchain.provider';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [ConfigModule, SecurityModule],
  providers: [BlockchainService, BlockchainProvider],
  controllers: [BlockchainController],
  exports: [BlockchainService],
})
export class BlockchainModule {}
