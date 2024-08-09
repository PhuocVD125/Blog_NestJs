import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PermissionComment } from 'src/helpers/checkPermissionComment';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Comment) private commentRepository: Repository<Comment>

    ) { }

    async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {

        const { content, status, postId } = createCommentDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        const post = await this.postRepository.findOne({ where: { id: postId } });

        if (!post || !user) {
            throw new NotFoundException('Post or User not found');
        }
        

        const comment = this.commentRepository.create({
            content,
            status,
            user,
            post,
        });

        return this.commentRepository.save(comment);
    }


    async update(id: number, updateCommentDto: UpdateCommentDto, currentUser: User): Promise<Comment> {

        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const userId = comment.user.id;
        PermissionComment.check(userId, currentUser);

        Object.assign(comment, updateCommentDto);
        return this.commentRepository.save(comment);
    }

    async delete(id: number, currentUser: User) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        
        const userId = comment.user.id;
        PermissionComment.check(userId, currentUser);

        await this.commentRepository.remove(comment);
    }

    async findAll(): Promise<Comment[]> {
        return this.commentRepository.find({ relations: ['user', 'post'] });
    }


    async findByPost(postId: number): Promise<Comment[]> {
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const res = await this.commentRepository.find({
            where: { post: { id: post.id } }, // Sử dụng post.id
        });
        console.log(res);
        return res;
    }
}
