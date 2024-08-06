import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Post, User, Category, Comment]),
    ConfigModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
