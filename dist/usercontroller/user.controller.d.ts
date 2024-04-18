import { Response } from 'express';
export declare class UserController {
    private users;
    createUser(user: {
        username: string;
        email: string;
        password: string;
    }, res: Response): {
        username: string;
        email: string;
    };
    loginUser(credentials: {
        email: string;
        password: string;
    }, res: Response): any;
}
