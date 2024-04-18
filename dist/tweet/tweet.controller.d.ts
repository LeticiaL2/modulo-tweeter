import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { TweetService } from './tweet.service';
export declare class TweetController {
    private readonly authService;
    private readonly tweetService;
    constructor(authService: AuthService, tweetService: TweetService);
    getAllTweets(): Promise<any>;
    createTweet(tweet: {
        message: string;
    }, req: Request, res: Response): Promise<any>;
    deleteTweet(id: number, res: Response): Promise<any>;
    getTweetById(id: number): Promise<any>;
    likeTweet(id: number, res: Response): Promise<any>;
    unlikeTweet(id: number, res: Response): Promise<any>;
    retweetTweet(id: number, tweet: {
        message: string;
    }, req: Request, res: Response): Promise<any>;
}
