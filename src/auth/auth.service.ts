import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    //check -> doc
    /* 
    promise dùng khi nào 
    -> Promise là đối tượng được sử dụng khi xử lý 
    các tác vụ bất đồng bộ (call API, đọc ghi tệp, truy vấn DB)
    
    tại sao: 
        return await this.userRepository.save({ ...registerUserDto, refresh_token: "refresh_token_string", password: hashPassword });
    -> Dấu 3 chấm (...) là spread operator, 
        được sử dụng để sao chép thuộc tính của đối tượng này sang đối tượng khác.
        refresh_token được thêm vào khi đăng ký để cấp cho người dùng 
        khả năng duy trì phiên làm việc 
        mà không cần phải đăng nhập lại khi access_token hết hạn.
    */
    // thêm validate
    async register(registerUserDto: RegisterUserDto) {
        const hashPassword = await this.hashPassword(registerUserDto.password)

        const { password, ...saveUser } = await this.userRepository.save({ ...registerUserDto, refresh_token: "refresh_token_string", password: hashPassword });
        return saveUser;
    }


    //login 
    async login(loginUserDto: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email }
        })

        if (!user) {
            throw new HttpException("Email is not exit", HttpStatus.UNAUTHORIZED);
        }

        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!checkPass) {
            throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED);
        }

        // generate access token and refresh token
        const payload = { id: user.id, email: user.email };
        return this.generateToken(payload);
    }

    async refreshToken(refresh_token: string) {

        const verify = await this.jwtService.verifyAsync(refresh_token, {
            secret: this.configService.get<string>('SECRET')
        })

        console.log(verify);
        const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token });

        if (!checkExistToken) {
            throw new HttpException('Refresh_token is not valid', HttpStatus.BAD_REQUEST);
        }

        return this.generateToken({ id: verify.id, email: verify.email });
    }

    // bổ sung
    // access_token la gi
    // refress_token la gi
    /*
    access_token: Là token ngắn hạn, chứa thông tin người dùng, 
    được sử dụng để truy cập các tài nguyên bảo vệ. tần suất sử dụng nhiều hơn
    refresh_token: Là token dài hạn, được sử dụng để yêu cầu cấp phát access_token mới 
    khi access_token hết hạn, giúp duy trì phiên làm việc của người dùng mà không cần đăng nhập lại.
    */

    // bảo mật token: trình duyệt lưu vào cookie http only 

    // private async generateToken(payload: { id: number, email: string }) {
    //     const access_token = await this.jwtService.signAsync(payload);
    //     const refresh_token = await this.jwtService.signAsync(payload, {
    //         secret: this.configService.get<string>('SECRET'),
    //         expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    //     })

    //     await this.userRepository.update(
    //         { email: payload.email },
    //         { refresh_token: refresh_token }
    //     )

    //     return { access_token, refresh_token };
    // }

    private async generateToken(payload: { id: number, email: string }) {
        const refreshExpiresIn = this.configService.get<string>('EXP_IN_REFRESH_TOKEN');
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: refreshExpiresIn
        });
        console.log('Refresh Token Expires In:', refreshExpiresIn);

        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: refreshExpiresIn
        });

        await this.userRepository.update(
            { email: payload.email },
            { refresh_token: refresh_token }
        );

        return { access_token, refresh_token };
    }


    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
}
