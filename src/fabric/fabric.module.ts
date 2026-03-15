import { Module } from '@nestjs/common';
import { FabricService } from './fabric.service';

@Module({
  providers: [FabricService],
  exports: [FabricService],
})
export class FabricModule {}
