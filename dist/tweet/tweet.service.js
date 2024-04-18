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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetService = void 0;
const common_1 = require("@nestjs/common");
const tweet_repository_1 = require("./tweet.repository");
let TweetService = class TweetService {
    constructor(tweetRepository) {
        this.tweetRepository = tweetRepository;
    }
    async createTweet(message, userId) {
        return this.tweetRepository.createTweet(message, userId);
    }
    async getAllTweets() {
        return this.tweetRepository.getAllTweets();
    }
    async deleteTweet(id) {
        return this.tweetRepository.deleteTweet(id);
    }
    async getTweetById(id) {
        return this.tweetRepository.getTweetById(id);
    }
    async likeTweet(id) {
        return this.tweetRepository.likeTweet(id);
    }
    async unlikeTweet(id) {
        return this.tweetRepository.unlikeTweet(id);
    }
    async retweetTweet(message, userId, retweetOf) {
        return this.tweetRepository.retweetTweet(message, userId, retweetOf);
    }
};
exports.TweetService = TweetService;
exports.TweetService = TweetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tweet_repository_1.TweetRepository])
], TweetService);
//# sourceMappingURL=tweet.service.js.map