import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { MessageType } from 'src/entities/general-chat.entity';

export class GeneralSendDto {
  @ApiProperty({ example: 'Hello world!', description: 'Message content' })
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message: string;

  @ApiProperty({ example: 'text', description: 'Type of message', enum: MessageType })
  @IsEnum(MessageType)
  messageType: MessageType;
}
