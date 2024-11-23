import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from 'src/posts/post.entity';

@Entity('PostImages')
export class PostImage {
  @PrimaryGeneratedColumn()
  image_id: number;

  @ManyToOne(() => Post, (post) => post.images, {
    nullable: false,
    onDelete: 'CASCADE',
    
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  // Change image_url to store the base64-encoded string
  @Column({ type: 'text', nullable: false }) // Use 'text' for base64 image string
  image_url: string; // Storing the base64 string here

  @CreateDateColumn({ type: 'datetime', default: () => 'GETDATE()' })
  uploaded_at: Date;
}