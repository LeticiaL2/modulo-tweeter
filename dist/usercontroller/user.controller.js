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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
let UserController = class UserController {
    constructor() {
        this.users = [];
    }
    createUser(user, res) {
        const newUser = {
            username: user.username,
            email: user.email,
            password: user.password,
        };
        this.users.push(newUser);
        res.status(common_1.HttpStatus.CREATED).send(this.users);
        return { username: newUser.username, email: newUser.email };
    }
    loginUser(credentials, res) {
        const user = this.users.find(u => u.email === credentials.email);
        if (user && user.password === credentials.password) {
            return res.status(common_1.HttpStatus.OK).json({ message: 'Login OK', user: { username: user.username, email: user.email } });
        }
        else {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'Erro no login' });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "loginUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api/users')
], UserController);
//# sourceMappingURL=user.controller.js.map