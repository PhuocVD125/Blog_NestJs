import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request  } from "express";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>
    ){};

    async canActivate(context: ExecutionContext) {
        // Lấy request
        const request = context.switchToHttp().getRequest();
        // Lấy token ở trong request
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException();
        } 

        try {
            // Xác minh token sử dụng JwtService và secret từ ConfigService
            const payload = await this.jwtService.verifyAsync(token, {
                secret : this.configService.get<string>('SECRET')
            })


            // Gắn payload vào đối tượng request để sử dụng sau này
            request['user_data'] = payload;
            request.user = payload;

            // const user = await this.userRepository.findOne(payload.id);
            request.currentUser = payload;
            console.log("current user:");
            console.log(request.currentUser);

        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    // Lấy token trong header
    private extractTokenFromHeader(request: Request): string|undefined {
        // Tách header Authorization thành type và token
        const[type, token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
        // Trả về token nếu type là 'Bearer', nếu không trả về undefined
        return type === 'Bearer' ? token : undefined;
    }
}