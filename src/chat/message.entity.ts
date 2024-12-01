import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('Messages')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  sent_at: Date;

  @Column({ type: 'datetime' })
  expires_at: Date;
}
