import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum CommentStatus {
    ACTIVE = 'active',
    DELETED = 'deleted',
}

export class UpdateCommentDto {

    @IsString()
    @IsOptional()
    content: string;

    @IsEnum(CommentStatus)
    @IsNotEmpty()
    status: string;
}