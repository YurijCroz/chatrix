import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GeneralChat } from './general-chat.entity';
import { UserAuth } from './user-auth.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John', description: 'first name' })
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ example: new Date(), description: 'createdAt' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date(), description: 'updatedAt' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GeneralChat, (generalChat) => generalChat.user, { cascade: true })
  messages: GeneralChat[];

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user, { cascade: true })
  auth: UserAuth;
}
