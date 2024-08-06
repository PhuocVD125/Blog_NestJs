import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Brackets, DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PermissionPost } from 'src/helpers/checkPermissionPost';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>

    ) { }

    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Trích xuất danh sách các ID danh mục từ DTO
        const { categoryIds, ...postDetails } = createPostDto;
        console.log(categoryIds);

        // Chuyển đổi các ID danh mục từ chuỗi thành số nguyên
        const categoryIdsAsNumbers = categoryIds?.map(id => parseInt(id, 10)) || [];
        console.log(categoryIdsAsNumbers);

        // Kiểm tra xem có categoryIds không
        let categories = [];
        if (categoryIdsAsNumbers.length > 0) {
            // Tìm các danh mục theo ID
            categories = await this.categoryRepository.find({
                where: { id: In(categoryIdsAsNumbers) },
            });

            console.log(categories);

            // Kiểm tra nếu tất cả các danh mục đã được tìm thấy
            if (categories.length !== categoryIdsAsNumbers.length) {
                throw new NotFoundException('One or more categories not found');
            }
        }



        // Tạo đối tượng bài viết và thêm danh mục vào
        const Newpost = this.postRepository.create({
            ...postDetails,
            user,
            categories, // Thêm các danh mục vào bài viết
        });

        console.log(Newpost);
        // Lưu bài viết vào cơ sở dữ liệu
        return await this.postRepository.save(Newpost);
    }

    async findAll(query: FilterPostDto) {
        const itemsPerPage = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';

        const skip = (page - 1) * itemsPerPage;

        // Sử dụng QueryBuilder để thực hiện lọc
        const queryBuilder = this.postRepository.createQueryBuilder('post')
            .where(new Brackets(qb => {
                qb.where('post.title LIKE :search', { search: `%${search}%` })
                    .orWhere('post.description LIKE :search', { search: `%${search}%` });
            }))
            .orderBy('post.created_at', 'DESC')
            .skip(skip)
            .take(itemsPerPage);

        // Thực hiện truy vấn
        const [posts, total] = await queryBuilder.getManyAndCount();

        const lastPage = Math.ceil(total / itemsPerPage);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: posts,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }


    async findDetail(id: number): Promise<Post> {
        // Sử dụng QueryBuilder để lấy bài viết với các mối quan hệ
        const post = await this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.categories', 'category')
            .where('post.id = :id', { id })
            .addSelect([
                'user.id',
                'user.first_name',
                'user.last_name',
                'user.email',
                'user.avatar',
                'category.id',
                'category.title',
            ])
            .getOne();

        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }

        return post;
    }


    async update(id: number, updatePostDto: UpdatePostDto, currentUser: User): Promise<UpdateResult> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });

        if (!post) {
            throw new Error('Post not found');
        }
        const userId = post.user.id;
        PermissionPost.check(userId, currentUser);
        return await this.postRepository.update(id, updatePostDto);
    }


    async delete(id: number, currentUser: User): Promise<DeleteResult> {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });

        if (!post) {
            throw new Error('Post not found');
        }
        const userId = post.user.id;
        PermissionPost.check(userId, currentUser);
        return await this.postRepository.delete(id);
    }
}
