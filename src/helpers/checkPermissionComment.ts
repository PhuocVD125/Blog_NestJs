import { BadRequestException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";

export class PermissionComment {
    static check(id: number, CurrentUser: User) {
        if(id === CurrentUser.id) return;
        throw new BadRequestException('User can not perform action')
    }
}   