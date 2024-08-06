import { IsNotEmpty } from "class-validator";
import { Entity } from "typeorm";

export class UpdateCategoryDto {

    @IsNotEmpty()
    title:string;

    meta_title:string;

    description:string;

    slug:string;

    status:string;
}