import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ['active', 'deleted'],
        default: 'active'
    })
    status: string;

    @Column()
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    publish_at: Date;

    @ManyToOne(() => User, (user) => user.comments, {
        onDelete: "CASCADE"
    })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments, {
        onDelete: "CASCADE"
    })
    post: Post;
}