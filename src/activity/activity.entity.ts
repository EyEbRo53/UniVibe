import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import {Interest} from '../interests/interest.entity'
import { Post } from 'src/posts/post.entity';

import { Group } from "src/groups/group.entity";
@Entity()
export class Activity {

  @PrimaryGeneratedColumn()
  activity_id: number;

  @Column({ type: 'varchar', length: 255, unique: true ,nullable:false})
  type_name: string;
  
  
  @OneToMany(() => Interest, (interest) => interest.activity)
  interests: Interest[];

  @OneToMany(() => Post, (post) => post.activityType)
  posts: Post[];

  @OneToMany(()=>Group,(group)=>group.activity)
  groups: Group[]
}


