import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    
    @ApiProperty()
    frist_name: string;

    @ApiProperty()
    middle_name: string ;
    
    @ApiProperty()
    last_name: string ;
    
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    password: string;
    
    @ApiProperty()
    status: string;
}