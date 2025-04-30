// 1. User Entity (user.entity.ts)
import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Interest } from '../../interests/entities/interest.entity';
import { Project } from '../../projects/entities/project.entity';
import { Investment } from '../../investments/entities/investment.entity';

export enum UserRole {
    ENTREPRENEUR = 'entrepreneur',
    INVESTOR = 'investor',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.ENTREPRENEUR,
    })
    role: UserRole;

    @ManyToMany(() => Interest)
    @JoinTable()
    interests: Interest[];

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];

    @OneToMany(() => Investment, (investment) => investment.investor)
    investments: Investment[];
}
