import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('UserContacts')
@Unique(['contact_type', 'contact_value']) // Enforcing uniqueness for contact_type and contact_value
export class UserContacts {
  @PrimaryGeneratedColumn()
  contact_id: number;

  @ManyToOne(() => User, (user) => user.userContacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  contact_type: string;

  @Column({ type: 'varchar', length: 255 })
  contact_value: string;
}

