import { Delete, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { PermissionUser } from 'src/helpers/checkPermissionUser';
import { plainToClass } from 'class-transformer';
import { ResponseUserDTO } from './dto/response-user.dto';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async findAll(query: FilterUserDto) {

        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const keyword = query.search || '';
        const [res, total] = await this.userRepository.findAndCount({
            where: [
                {first_name: Like('%' + keyword + '%')},
                {last_name: Like('%' + keyword + '%')},
                {email: Like('%' + keyword + '%')}
            ],
            // order: {created_at: "DESC"},
            take: items_per_page,
            skip: skip,
            select: ['id', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'role', 'created_at', 'updated_at']
        })

        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null: page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        // set độ trễ trả về kết quả
        // await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }

    }


    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        // Sử dụng plainToClass để chuyển đổi từ entity sang DTO
        return plainToClass(ResponseUserDTO, user, { excludeExtraneousValues: true });
    }


    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        return await this.userRepository.save(createUserDto);
    }

    async updateInfoUser(id: number, updateUserDto: UpdateUserDto, currentUser: User): Promise<UpdateResult> {
        // TODO check ton tai
        PermissionUser.check(id, currentUser);
        return await this.userRepository.update(id, updateUserDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        // TODO check ton tai
        return await this.userRepository.delete(id);
    }

    async multipleDelete(ids: string[]): Promise<DeleteResult> {
        return await this.userRepository.delete({id: In(ids)});
    }

    async updateAvatar(id: number, avatar: string, currentUser: User): Promise<UpdateResult> {
        PermissionUser.check(id, currentUser);
        return await this.userRepository.update(id, {avatar});
    }
    async updateUserStatus(id: number, updateStatusDto: UpdateUserDto) {
        // Tìm người dùng theo ID
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Cập nhật trạng thái
        user.status = updateStatusDto.status;

        // Lưu thay đổi vào cơ sở dữ liệu
        await this.userRepository.save(user);

        return plainToClass(ResponseUserDTO, user, { excludeExtraneousValues: true });
    }

    async updateUserRole(id: number, updateRoleDto: UpdateRoleUserDto) {
        // Tìm người dùng theo ID
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Cập nhật trạng thái
        user.role = updateRoleDto.role;

        // Lưu thay đổi vào cơ sở dữ liệu
        await this.userRepository.save(user);

        return plainToClass(ResponseUserDTO, user, { excludeExtraneousValues: true });
    }

}
