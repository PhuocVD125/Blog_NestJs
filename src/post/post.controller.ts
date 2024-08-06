import { BadRequestException, Body, Controller, Delete, Get, Post, Param, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CurrentUser } from 'src/user/decorators/currentUser.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostController {

    constructor(private postService: PostService) { }


    // @Roles("admin", "user")
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5 MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
            
        }
    }))
    create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
        console.log(req['user_data']);
        console.log(createPostDto);
        console.log(file);
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('File is required')
        }

        return this.postService.create(req['user_data'].id, { ...createPostDto, thumbnail: file.destination + '/' + file.filename });
    }

    // TODO thay đổi status bài viết

    @Roles("admin", "user")
    @Get()
    findAll(@Query() query: FilterPostDto): Promise<any> {
        return this.postService.findAll(query);
    }
    


    @Roles("admin", "user")
    @Get(':id')
    findDetail(@Param('id') id: string): Promise<PostEntity> {
        return this.postService.findDetail(+id); // number 
    }

    @Roles("admin", "user")
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg'];
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            } else {
                const fileSize = parseInt(req.headers['content-length']);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5 MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    update(@Param('id') id: string, @Req() req: any, @Body() updatePostDto: UpdatePostDto, @UploadedFile() file: Express.Multer.File, @CurrentUser() CurrentUser) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }

        return this.postService.update(Number(id), updatePostDto, CurrentUser);
    }

    @Roles("admin", "user")
    @Delete(':id')
    delete(@Param('id') id: string, @CurrentUser() currentUser) {
        return this.postService.delete(Number(id), currentUser)
    }
}
