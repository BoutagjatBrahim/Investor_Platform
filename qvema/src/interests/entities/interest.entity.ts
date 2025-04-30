// 1. Interest Entity (interest.entity.ts)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('interests')
export class Interest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;
}
