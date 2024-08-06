import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Post, User, Comment]),
    ConfigModule
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
