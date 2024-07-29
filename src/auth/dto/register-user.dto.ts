import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator'
export class RegisterUserDto {
    
    @IsNotEmpty()
    @ApiProperty()
    frist_name: string;

    @ApiProperty()
    @IsNotEmpty()
    middle_name: string ;
    
    @ApiProperty()
    @IsNotEmpty()
    last_name: string ;
    
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty()
    @IsNotEmpty()
    password: string;
    
    @ApiProperty()
    @IsNotEmpty()
    status: string;
}