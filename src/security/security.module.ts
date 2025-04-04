import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { RsaService } from './rsa.service';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [SecurityService, RsaService],
  exports: [SecurityService, RsaService],
})
export class SecurityModule {}
