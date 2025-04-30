// 2. Interest Service (interests.service.ts)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from '../common/dto/create-interest.dto';

@Injectable()
export class InterestsService {
    constructor(
        @InjectRepository(Interest)
        private interestsRepository: Repository<Interest>,
    ) { }

    async create(createInterestDto: CreateInterestDto): Promise<Interest> {
        const interest = this.interestsRepository.create(createInterestDto);
        return this.interestsRepository.save(interest);
    }

    async findAll(): Promise<Interest[]> {
        return this.interestsRepository.find();
    }
}
