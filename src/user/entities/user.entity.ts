import { Exclude } from 'class-transformer';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['admin', 'user', 'guest'], default: 'user' })
  role: string;

  @Column()
  first_name: string;

  @Column()
  middle_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true }) 
  intro: string;

  @Column({ unique: true }) // ensure email is unique
  email: string;

  @Column()
  // @Exclude()
  // setup ẩn
  password: string;

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended', 'pending', 'deleted'], default: 'active' })
  status: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]
  
}