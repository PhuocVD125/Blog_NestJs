import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject, IsEnum, IsOptional, IsInt, IsArray } from 'class-validator';
import { Category } from 'src/category/entities/category.entity';

export enum PostStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending',
    DELETED = 'deleted',
  }

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  thumbnail: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @IsString()
  @IsNotEmpty()
  slug: string;


  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  meta_title: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
