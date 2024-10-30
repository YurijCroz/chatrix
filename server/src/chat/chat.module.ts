import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatsService } from './chat.service';
import { ChatsController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserAuth } from 'src/entities/user-auth.entity';
import { GeneralChat } from 'src/entities/general-chat.entity';
import { ChatsGateway } from 'src/gateways/chats.gateway';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuth, GeneralChat]),
    forwardRef(() => AppModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ChatsService, ChatsGateway],
  controllers: [ChatsController],
  exports: [ChatsService],
})
export class ChatsModule {}
