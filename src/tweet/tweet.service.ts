import { Injectable } from '@nestjs/common';
import { TweetRepository } from './tweet.repository';

@Injectable()
export class TweetService {
  constructor(private readonly tweetRepository: TweetRepository) {}

  async createTweet(message: string, userId: number) {
    return this.tweetRepository.createTweet(message, userId);
  }

  async getAllTweets() {
    return this.tweetRepository.getAllTweets();
  }

  async deleteTweet(id: number) {
    return this.tweetRepository.deleteTweet(id);
  }

  async getTweetById(id: number) {
    return this.tweetRepository.getTweetById(id);
  }

  async likeTweet(id: number) {
    return this.tweetRepository.likeTweet(id);
  }

  async unlikeTweet(id: number) {
    return this.tweetRepository.unlikeTweet(id);
  }

  async retweetTweet(
    message: string,
    userId: number,
    retweetOf?: number
  ) {
    return this.tweetRepository.retweetTweet(message, userId, retweetOf);
  }
}
