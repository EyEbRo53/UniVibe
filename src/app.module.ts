// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { Module } from '@nestjs/common';
// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { User } from './users/user.entity'; // Import the User entity
// import { UserService } from './users/user.service';
// import { UserController } from './users/user.controller';
// import { AppDataSource } from './data-source';
// import { AuthController } from './auth/auth.controller';
// import { AuthService } from './auth/auth.service';
// import { AuthModule } from './auth/auth.module';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ConfigModule } from '@nestjs/config';
// import { ActivityController } from './activity/activity.controller';
// import { ActivityService } from './activity/activity.service';
// import { Activity } from './activity/activity.entity';
// import { InterestService } from './interests/interest.service';
// import { InterestController } from './interests/interest.controller';
// import { Interest } from './interests/interest.entity';
// import { UserContactsService } from './userContacts/userContacts.service';
// import { UserContacts } from './userContacts/userContacts.entity';
// import { UserContactController } from './userContacts/userContacts.controller';
// import { Group } from './groups/group.entity';
// import { GroupController} from './groups/group.controller';
// import { GroupService } from './groups/group.service';
// import { GroupMembership } from './groupMember/groupMember.entity';
// import { GroupMembershipService } from './groupMember/groupMember.service';
// import { GroupMembershipController } from './groupMember/groupMember.controller';
// import { PostImage } from './postImages/postImage.entity';
// import { ScheduleModule } from '@nestjs/schedule';
// import {Post} from './posts/post.entity'
// import { PostService } from './posts/post.service';
// import { PostImageService } from './postImages/postImage.service';
// import { PostController } from './posts/post.controller';
// import { PostImageController } from './postImages/postImageController';
// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot(AppDataSource.options),
//     TypeOrmModule.forFeature([
//       User,
//       Activity,
//       Interest,
//       UserContacts,
//       Post,
//       PostImage,
//     ,Group,GroupMembership,

//   ]),
//     ScheduleModule.forRoot(),
//     AuthModule,
//   ],
//   providers: [UserService, AuthService, JwtService,ActivityService,InterestService,UserContactsService,GroupService,GroupMembershipService,PostService,PostImageService],  // Register the service
//   controllers: [UserController, AuthController,ActivityController,InterestController,UserContactController,GroupController,GroupMembershipController,PostController,PostImageController],  // Register the controller
// })
// export class AppModule {}

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity'; // Import the User entity
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import { AppDataSource } from './data-source';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ActivityController } from './activity/activity.controller';
import { ActivityService } from './activity/activity.service';
import { Activity } from './activity/activity.entity';
import { InterestService } from './interests/interest.service';
import { InterestController } from './interests/interest.controller';
import { Interest } from './interests/interest.entity';
import { UserContactsService } from './userContacts/userContacts.service';
import { UserContacts } from './userContacts/userContacts.entity';
import { UserContactController } from './userContacts/userContacts.controller';
import { Group } from './groups/group.entity';
import { GroupController } from './groups/group.controller';
import { GroupService } from './groups/group.service';
import { GroupMembership } from './groupMember/groupMember.entity';
import { GroupMembershipService } from './groupMember/groupMember.service';
import { GroupMembershipController } from './groupMember/groupMember.controller';
import { PostImage } from './postImages/postImage.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Post } from './posts/post.entity';
import { PostService } from './posts/post.service';
import { PostController } from './posts/post.controller';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { Message } from './chat/message.entity';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([
      User,
      Activity,
      Interest,
      UserContacts,
      Post,
      PostImage,
      Group,
      GroupMembership,
      Message,
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    ChatModule,
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ActivityService,
    InterestService,
    UserContactsService,
    GroupService,
    GroupMembershipService,
    PostService,
    ChatGateway,
    ChatService,
  ], // Register the service
  controllers: [
    UserController,
    AuthController,
    ActivityController,
    InterestController,
    UserContactController,
    GroupController,
    GroupMembershipController,
    PostController,
    ChatController,
  ], // Register the controller
})
export class AppModule {}
