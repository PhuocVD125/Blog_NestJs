import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Post } from "src/post/entities/post.entity";

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

    @IsInt()
    @IsNotEmpty()
    userId: number;
}