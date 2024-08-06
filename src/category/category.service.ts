import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) private categoryRepository:Repository<Category>){}

    async findAll():Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async findOne(id: number) {
        return await this.categoryRepository.findOneBy({id});
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {

        const res = await this.categoryRepository.save({
            ...createCategoryDto});

        console.log(res);

        return await this.categoryRepository.findOneBy({ id: res.id });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
        const category = await this.categoryRepository.findOneBy({id});

        return await this.categoryRepository.update(id, updateCategoryDto);
    }
    
    async delete(id: number): Promise<DeleteResult> {
        const category = await this.categoryRepository.findOneBy({id});

        return await this.categoryRepository.delete(id);
    }
}
