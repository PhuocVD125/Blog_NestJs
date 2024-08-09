import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from 'src/user/decorators/currentUser.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('comments')
@UseGuards(AuthGuard, RolesGuard)
export class CommentController {
    constructor (private commentService: CommentService) { }

    @Post()
    create(@Body('userId') userId: number, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.create(userId, createCommentDto);
    }

    
    @Get()
    findAll() {
        return this.commentService.findAll();
    }

    @Get('post/:postId')
    findByPost(@Param('postId') postId: number) {
        return this.commentService.findByPost(postId);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto, @CurrentUser() CurrentUser) {
        return this.commentService.update(id, updateCommentDto, CurrentUser);
    }

    @Delete(':id')
    delete(@Param('id') id: number, @CurrentUser() CurrentUser) {
        return this.commentService.delete(id, CurrentUser);
    }

}
