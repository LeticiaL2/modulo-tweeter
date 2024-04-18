import { Controller, Get, Post, Res, Delete, Param, Body, HttpStatus, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request} from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TweetService } from './tweet.service';

@Controller('api/tweets')
export class TweetController {
  constructor(
    private readonly authService: AuthService,
    private readonly tweetService: TweetService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTweets(): Promise<any> {
    return this.tweetService.getAllTweets();
  }

  @UseGuards(JwtAuthGuard) 
  @Post()
  async createTweet(@Body() tweet: { message: string }, @Req() req: Request, @Res() res: Response): Promise<any> {
    const token = req.headers.authorization.split(' ')[1]; 
    const userId = this.authService.getUserIdFromToken(token);
    const newTweet = await this.tweetService.createTweet(tweet.message, userId);
    res.status(HttpStatus.CREATED).send(newTweet); 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTweet(@Param('id') id: number, @Res() res: Response): Promise<any> {
    await this.tweetService.deleteTweet(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTweetById(@Param('id') id: number): Promise<any> {
    return this.tweetService.getTweetById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeTweet(@Param('id') id: number, @Res() res: Response): Promise<any> {
    await this.tweetService.likeTweet(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikeTweet(@Param('id') id: number, @Res() res: Response): Promise<any> {
    await this.tweetService.unlikeTweet(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/retweet')
  async retweetTweet(@Param('id') id: number, @Body() tweet: { message: string }, @Req() req: Request, @Res() res: Response): Promise<any> {
    const token = req.headers.authorization.split(' ')[1]; 
    const userId = this.authService.getUserIdFromToken(token);
    const retweet = await this.tweetService.retweetTweet(tweet.message, userId, id);
    res.status(HttpStatus.CREATED).send(retweet);
  }
}
