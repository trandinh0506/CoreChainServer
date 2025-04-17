import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host:
          configService.get('UPSTASH_ENDPOINT') ||
          'dynamic-gelding-23048.upstash.io',
        port: configService.get('UPSTASH_PORT') || 6379,
        password: configService.get('UPSTASH_TOKEN'),
        ttl: configService.get('CACHE_TTL') || 300,
        tls: configService.get('UPSTASH_TLS') === 'true',
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
