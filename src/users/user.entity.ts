import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserContacts } from 'src/userContacts/userContacts.entity';
import { Interest } from '../interests/interest.entity';
import { Post } from 'src/posts/post.entity';
import { Group } from "src/groups/group.entity";
import { GroupMembership } from "src/groupMember/groupMember.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash: string | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_pic_url: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  oauth_provider: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  oauth_id: string | null;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @OneToMany(() => UserContacts, (userContacts) => userContacts.user)
  userContacts: UserContacts[];

  @OneToMany(() => Interest, (interest) => interest.user)
  interests: Interest[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(()=>Group,(group)=>group.owner)
  owner:Group[];


  @OneToMany(() => GroupMembership, membership => membership.user)
  memberships: GroupMembership[];
}
