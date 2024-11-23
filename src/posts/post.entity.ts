import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Activity } from 'src/activity/activity.entity';
import { PostImage } from 'src/postImages/postImage.entity';

@Entity('Posts')
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null;

  @ManyToOne(() => Activity, (activityType) => activityType.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  activityType: Activity;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => PostImage, (postImage) => postImage.post, { cascade: true })
  images: PostImage[];

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: false })
  expires_at: Date;

}
