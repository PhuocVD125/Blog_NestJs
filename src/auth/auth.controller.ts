import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 201, description: 'Login successfully!' })
    @ApiResponse({ status: 401, description: 'Login fail!' })
    // về pipe
    /* 
    Pipes là một trong những tính năng mạnh mẽ của NestJS,
    được sử dụng để biến đổi hoặc xác thực 
    dữ liệu trước khi đến với handler (phương thức của controller).

    ValidationPipe trong NestJS
    ValidationPipe là một pipe được tích hợp sẵn trong NestJS, 
    được sử dụng để xác thực dữ liệu đầu vào dựa trên các DTO (Data Transfer Objects).
    Khi sử dụng ValidationPipe, NestJS sẽ kiểm tra các đối tượng được truyền vào 
    các handler của controller xem có tuân thủ các ràng buộc được định nghĩa trong DTO hay không. 
    Nếu không, sẽ ném ra lỗi (exception).
    */
    login(@Body() loginUserDto: LoginUserDto): any {

        console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

    // để làm gì
    // Làm mới JWT token khi hết hạn
    /*
    Về JWT
    JWT (JSON Web Token) là một tiêu chuẩn mở (RFC 7519) định nghĩa một cách nhỏ gọn và an toàn 
    để truyền tải thông tin giữa các bên dưới dạng một đối tượng JSON.
    JWT được sử dụng rộng rãi trong việc xác thực và ủy quyền trong các ứng dụng web.

    Công dụng của JWT
    Xác thực (Authentication): JWT thường được sử dụng để xác thực người dùng. 
        Khi người dùng đăng nhập thành công, server sẽ tạo ra một JWT và gửi về cho client. 
        Client sẽ gửi JWT này kèm theo các yêu cầu HTTP để chứng minh danh tính của mình.
    Ủy quyền (Authorization): Dựa trên các claims trong payload của JWT, 
        server có thể xác định quyền truy cập của người dùng tới các tài nguyên hoặc dịch vụ cụ thể.
    Truyền tải thông tin an toàn: JWT cho phép truyền tải thông tin giữa các bên một cách an toàn 
        và đảm bảo tính toàn vẹn của dữ liệu.
    */
    @Post('refresh-token')
    refreshToken(@Body() { refresh_token }): void {
        console.log('refresh token api');
        this.authService.refreshToken(refresh_token);
    }
}
