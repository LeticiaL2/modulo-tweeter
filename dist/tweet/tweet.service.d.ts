import { TweetRepository } from './tweet.repository';
export declare class TweetService {
    private readonly tweetRepository;
    constructor(tweetRepository: TweetRepository);
    createTweet(message: string, userId: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
    getAllTweets(): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }[]>;
    deleteTweet(id: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
    getTweetById(id: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
    likeTweet(id: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
    unlikeTweet(id: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
    retweetTweet(message: string, userId: number, retweetOf?: number): Promise<{
        id: number;
        message: string;
        likes: number;
        userId: number;
    }>;
}
