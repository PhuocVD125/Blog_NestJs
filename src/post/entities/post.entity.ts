import { Category } from "src/category/entities/category.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    thumbnail: string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'suspended', 'pending', 'deleted'],
        default: 'active'
    })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    publish_at: Date;

    // url cơ bản
    @Column()
    slug: string;

    @Column()
    body: string;

    // url chuẩn seo
    @Column()
    meta_title: string;

    // tóm tắt
    @Column()
    summary: string;

    // bài đăng nổi bật
    @Column({ type: "boolean", default: false })
    is_featured: boolean;

    // ảnh trong bài viết
    @Column("simple-array", { nullable: true })
    image_gallery: string[];

    // view
    @Column({ type: "int", default: 0 })
    views: number;

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: "CASCADE"
    })
    user: User;

    @ManyToOne(() => Category, (category) => category.posts)
    category: Category;
}