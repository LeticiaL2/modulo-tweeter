import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TweetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTweet(message: string, userId: number) {
    return this.prisma.tweet.create({
      data: {
        message,
        likes: 0,
        userId,
      },
    });
  }

  async getAllTweets() {
    return this.prisma.tweet.findMany();
  }

  async deleteTweet(id: number) {
    return this.prisma.tweet.delete({
      where: { id },
    });
  }

  async getTweetById(id: number) {
    return this.prisma.tweet.findUnique({
      where: { id },
    });
  }

  async likeTweet(id: number) {
    return this.prisma.tweet.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  async unlikeTweet(id: number) {
    return this.prisma.tweet.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    });
  }

  async retweetTweet(
    message: string,
    userId: number,
    retweetOf?: number
  ) {
    const data = {
      message,
      likes: 0,
      userId,
      retweetOf,
    };

    return this.prisma.tweet.create({
      data,
    });
  }
}
