import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    //throttler limit in 60 seconds, maximum 10 requests
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60 * 1000,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BlockchainModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
