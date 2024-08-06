import { Category } from "src/category/entities/category.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    content: string;

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

    @ManyToMany(() => Category, (category) => category.posts)
    categories: Category[];

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]
}