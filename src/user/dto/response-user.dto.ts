import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ResponseUserDTO {
    
    @Expose()
    @ApiProperty()
    first_name: string;

    @Expose()
    @ApiProperty()
    middle_name: string ;
    
    @Expose()
    @ApiProperty()
    last_name: string ;
    
    @Expose()
    @ApiProperty()
    email: string;
    
    @Expose()
    @ApiProperty()
    intro: string;

    @Expose()
    @ApiProperty()
    phone_number: string;

    @Expose()
    @ApiProperty()
    status: string;
    
    @Expose()
    @ApiProperty()
    role: string;
}