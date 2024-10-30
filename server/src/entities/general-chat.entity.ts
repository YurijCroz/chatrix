import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export enum MessageType {
  TEXT = 'text',
  PICTURE = 'picture',
  VOICE = 'voice',
}

@Entity('general_chats')
export class GeneralChat {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Hello world!', description: 'message' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ example: new Date(), description: 'createdAt' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'updatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'text', description: 'Type of message' })
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;
  
  @ManyToOne(() => User, (user) => user.messages)
  user: User;
}
