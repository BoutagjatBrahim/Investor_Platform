// 4. User Service (users.service.ts)
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { Interest } from '../interests/entities/interest.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Interest)
        private interestsRepository: Repository<Interest>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({ relations: ['interests'] });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['interests'],
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string): Promise<User> {
        const user = await this.findOne(id);

        if (id !== currentUserId) {
            throw new ForbiddenException(`Vous n'êtes pas autorisé à modifier ce profil`);
        }

        const { firstName, lastName } = updateUserDto;

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const result = await this.usersRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
        }
    }

    async addInterests(userId: string, interestIds: string[]): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['interests'],
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
        }

        const interests = await this.interestsRepository.findByIds(interestIds);

        if (!user.interests) {
            user.interests = [];
        }

        user.interests = [...user.interests, ...interests];

        return this.usersRepository.save(user);
    }

    async getUserInterests(userId: string): Promise<Interest[]> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['interests'],
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
        }

        return user.interests;
    }
}
