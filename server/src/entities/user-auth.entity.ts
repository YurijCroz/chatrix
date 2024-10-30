import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_auth')
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
