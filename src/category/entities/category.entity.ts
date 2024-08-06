import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description:string;

    @Column()
    title:string;

    @Column()
    meta_title:string;

    @Column()
    slug:string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'suspended', 'pending', 'deleted'],
        default: 'active'
    })
    status: string;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;

    @ManyToMany(() => Post, (post) => post.categories)
    @JoinTable({
      name: 'category_posts', // Tên của bảng trung gian
      joinColumn: {
        name: 'category_id',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'post_id',
        referencedColumnName: 'id',
      },
    })
    posts: Post[];
}