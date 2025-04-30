// 4. Admin Service (admin.service.ts)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Investment)
        private investmentsRepository: Repository<Investment>,
    ) { }

    async getAllUsers(): Promise<User[]> {
        return this.usersRepository.find({ relations: ['interests'] });
    }

    async deleteUser(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async getAllInvestments(): Promise<Investment[]> {
        return this.investmentsRepository.find({
            relations: ['investor', 'project', 'project.owner'],
        });
    }
}
