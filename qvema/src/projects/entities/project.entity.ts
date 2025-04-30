
// 1. Project Entity (project.entity.ts)
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    budget: number;

    @Column()
    category: string;

    @ManyToOne(() => User, (user) => user.projects)
    owner: User;

    @Column()
    ownerId: string;

    @OneToMany(() => Investment, (investment) => investment.project)
    investments: Investment[];
}