import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { CurrentUser } from './decorators/currentUser.decorator';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard, RolesGuard) // Đảm bảo AuthGuard và RolesGuard được áp dụng trên toàn bộ controller
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    // lấy user đang trong phiên
    @Get('current-user')
    async getCurrentUser(@CurrentUser() user: any) {
        console.log('User từ @CurrentUser:', user);

        const userId = Number(user.id);
        console.log('User ID:', userId);

        if (!user || isNaN(userId)) {
            throw new Error('User not found or invalid');
        }

        const profile = await this.userService.findOne(userId);
        return profile;
    }

    // lấy tất cả acc - chỉ admin
    @Get()
    @Roles('admin')
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    findAll(@Query() query: FilterUserDto) {
        console.log(query);
        return this.userService.findAll(query);
    }

    // lấy ra thông tin 1 user - user và admin
    @Get(':id')
    @Roles('admin', 'user')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(Number(id));
    }

    // tạo 1 user mới - admin
    @Post()
    @Roles('admin')
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // update info user - chỉ user đó
    @Put(':id')
    @Roles('user')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser) {
        return this.userService.updateInfoUser(Number(id), updateUserDto, currentUser);
    }

    //xóa user - admin
    @Delete(':id')
    @Roles('admin')
    delete(@Param('id') id: string) {
        return this.userService.delete(Number(id));
    }

    // xóa 1 loạt - admin
    @Delete('multiple')
    @Roles('admin')
    multipleDelete(@Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[]) {
        console.log("delete multi=>", ids);
        return this.userService.multipleDelete(ids);
    }

    // upload avater - chỉ user đó 
    @Post('upload-avatar')
    @Roles('user')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
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
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File, @CurrentUser() currentUser) {
        console.log("upload");
        console.log(file);

        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename, currentUser);
    }

    // update status acc - admin
    @Put(':id/status')
    @Roles('admin')
    updateUserStatus(@Param('id') id: string, @Body() updateStatusDto) {
        // Logic to update user status
        return this.userService.updateUserStatus(Number(id), updateStatusDto);

    }

    // update role - admin
    @Put(':id/role')
    @Roles('admin')
    updateUserRole(@Param('id') id: string, @Body() updateRoleDto) {
        return this.userService.updateUserRole(Number(id), updateRoleDto);
    }
}
