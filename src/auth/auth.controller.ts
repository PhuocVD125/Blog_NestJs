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

    // Pipe infor in doc
    @Post('login')
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 201, description: 'Login successfully!' })
    @ApiResponse({ status: 401, description: 'Login fail!' })
    login(@Body() loginUserDto: LoginUserDto): any {

        console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

   // Refresh JWT token
    @Post('refresh-token')
    refreshToken(@Body() { refresh_token }): void {
        console.log('refresh token api');
        this.authService.refreshToken(refresh_token);
    }
}
