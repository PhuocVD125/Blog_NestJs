import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum CommentStatus {
    ACTIVE = 'active',
    DELETED = 'deleted',
}

export class CreateCommentDto {

    @IsString()
    @IsOptional()
    content?: string;

    @IsEnum(CommentStatus)
    @IsNotEmpty()
    status: CommentStatus;

    @IsInt()
    @IsNotEmpty()
    postId: number;
}