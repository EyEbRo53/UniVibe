"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const user_service_1 = require("./users/user.service");
const user_controller_1 = require("./users/user.controller");
const data_source_1 = require("./data-source");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const activity_controller_1 = require("./activity/activity.controller");
const activity_service_1 = require("./activity/activity.service");
const activity_entity_1 = require("./activity/activity.entity");
const interest_service_1 = require("./interests/interest.service");
const interest_controller_1 = require("./interests/interest.controller");
const interest_entity_1 = require("./interests/interest.entity");
const userContacts_service_1 = require("./userContacts/userContacts.service");
const userContacts_entity_1 = require("./userContacts/userContacts.entity");
const userContacts_controller_1 = require("./userContacts/userContacts.controller");
const group_entity_1 = require("./groups/group.entity");
const group_controller_1 = require("./groups/group.controller");
const group_service_1 = require("./groups/group.service");
const groupMember_entity_1 = require("./groupMember/groupMember.entity");
const groupMember_service_1 = require("./groupMember/groupMember.service");
const groupMember_controller_1 = require("./groupMember/groupMember.controller");
const postImage_entity_1 = require("./postImages/postImage.entity");
const schedule_1 = require("@nestjs/schedule");
const post_entity_1 = require("./posts/post.entity");
const post_service_1 = require("./posts/post.service");
const post_controller_1 = require("./posts/post.controller");
const chat_service_1 = require("./chat/chat.service");
const chat_module_1 = require("./chat/chat.module");
const chat_gateway_1 = require("./chat/chat.gateway");
const message_entity_1 = require("./chat/message.entity");
const chat_controller_1 = require("./chat/chat.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(data_source_1.AppDataSource.options),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                activity_entity_1.Activity,
                interest_entity_1.Interest,
                userContacts_entity_1.UserContacts,
                post_entity_1.Post,
                postImage_entity_1.PostImage,
                group_entity_1.Group,
                groupMember_entity_1.GroupMembership,
                message_entity_1.Message,
            ]),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            chat_module_1.ChatModule,
        ],
        providers: [
            user_service_1.UserService,
            auth_service_1.AuthService,
            jwt_1.JwtService,
            activity_service_1.ActivityService,
            interest_service_1.InterestService,
            userContacts_service_1.UserContactsService,
            group_service_1.GroupService,
            groupMember_service_1.GroupMembershipService,
            post_service_1.PostService,
            chat_gateway_1.ChatGateway,
            chat_service_1.ChatService,
        ],
        controllers: [
            user_controller_1.UserController,
            auth_controller_1.AuthController,
            activity_controller_1.ActivityController,
            interest_controller_1.InterestController,
            userContacts_controller_1.UserContactController,
            group_controller_1.GroupController,
            groupMember_controller_1.GroupMembershipController,
            post_controller_1.PostController,
            chat_controller_1.ChatController,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map