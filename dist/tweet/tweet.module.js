"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_module_1 = require("../prisma/prisma.module");
const tweet_controller_1 = require("./tweet.controller");
const tweet_service_1 = require("./tweet.service");
const auth_service_1 = require("../auth/auth.service");
const user_module_1 = require("../user/user.module");
const tweet_repository_1 = require("./tweet.repository");
let TweetModule = class TweetModule {
};
exports.TweetModule = TweetModule;
exports.TweetModule = TweetModule = __decorate([
    (0, common_1.Module)({ imports: [user_module_1.UserModule, prisma_module_1.PrismaModule, jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET })],
        controllers: [tweet_controller_1.TweetController],
        providers: [tweet_service_1.TweetService, auth_service_1.AuthService, tweet_repository_1.TweetRepository], })
], TweetModule);
//# sourceMappingURL=tweet.module.js.map