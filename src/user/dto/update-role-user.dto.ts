import { ApiProperty } from "@nestjs/swagger";

export class UpdateRoleUserDto {
    @ApiProperty()
    role: string;
}