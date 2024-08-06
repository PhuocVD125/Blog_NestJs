import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('categories')
@UseGuards(AuthGuard, RolesGuard)
export class CategoryController {

    constructor(private categoryService: CategoryService) { }

    @Get()
    @Roles("admin", "user")
    findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    @Get(":id")
    @Roles("admin", "user")
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(Number(id));
    }

    @Post()
    @Roles("admin")
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Put(":id")
    @Roles("admin")
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(Number(id), updateCategoryDto);
    }

    @Roles("admin")
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoryService.delete(Number(id))
    }
}

