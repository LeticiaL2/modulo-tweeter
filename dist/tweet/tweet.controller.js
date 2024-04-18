"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tweet_service_1 = require("./tweet.service");
let TweetController = class TweetController {
    constructor(authService, tweetService) {
        this.authService = authService;
        this.tweetService = tweetService;
    }
    async getAllTweets() {
        return this.tweetService.getAllTweets();
    }
    async createTweet(tweet, req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = this.authService.getUserIdFromToken(token);
        const newTweet = await this.tweetService.createTweet(tweet.message, userId);
        res.status(common_1.HttpStatus.CREATED).send(newTweet);
    }
    async deleteTweet(id, res) {
        await this.tweetService.deleteTweet(id);
        res.status(common_1.HttpStatus.NO_CONTENT).send();
    }
    async getTweetById(id) {
        return this.tweetService.getTweetById(id);
    }
    async likeTweet(id, res) {
        await this.tweetService.likeTweet(id);
        res.status(common_1.HttpStatus.NO_CONTENT).send();
    }
    async unlikeTweet(id, res) {
        await this.tweetService.unlikeTweet(id);
        res.status(common_1.HttpStatus.NO_CONTENT).send();
    }
    async retweetTweet(id, tweet, req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = this.authService.getUserIdFromToken(token);
        const retweet = await this.tweetService.retweetTweet(tweet.message, userId, id);
        res.status(common_1.HttpStatus.CREATED).send(retweet);
    }
};
exports.TweetController = TweetController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getAllTweets", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "createTweet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "deleteTweet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "getTweetById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "likeTweet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "unlikeTweet", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/retweet'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TweetController.prototype, "retweetTweet", null);
exports.TweetController = TweetController = __decorate([
    (0, common_1.Controller)('api/tweets'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        tweet_service_1.TweetService])
], TweetController);
//# sourceMappingURL=tweet.controller.js.map