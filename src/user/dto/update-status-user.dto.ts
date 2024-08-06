import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusUserDto {
    @ApiProperty()
    status: string;
}