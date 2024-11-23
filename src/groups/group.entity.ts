import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { User } from 'src/users/user.entity';
import { Activity } from '../activity/activity.entity';
import { GroupMembership } from "src/groupMember/groupMember.entity";

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  group_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  group_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  // Change @OneToOne to @ManyToOne
  @ManyToOne(() => Activity, activity => activity.groups)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.owner)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
  
  @OneToMany(() => GroupMembership, membership => membership.group)
  memberships: GroupMembership[];

}
