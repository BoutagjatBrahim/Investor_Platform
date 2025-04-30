// 2. Investment Service (investments.service.ts)
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from '../common/dto/create-investment.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvestmentsService {
    constructor(
        @InjectRepository(Investment)
        private investmentsRepository: Repository<Investment>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
    ) { }

    async create(createInvestmentDto: CreateInvestmentDto, userId: string): Promise<Investment> {
        // Vérifier que l'utilisateur est un investisseur
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user || user.role !== UserRole.INVESTOR) {
            throw new ForbiddenException('Seuls les investisseurs peuvent investir dans des projets');
        }

        // Vérifier que le projet existe
        const project = await this.projectsRepository.findOne({
            where: { id: createInvestmentDto.projectId },
        });

        if (!project) {
            throw new NotFoundException(`Projet avec ID ${createInvestmentDto.projectId} non trouvé`);
        }

        // Vérifier que l'investisseur n'est pas le propriétaire du projet
        if (project.ownerId === userId) {
            throw new BadRequestException(`Vous ne pouvez pas investir dans votre propre projet`);
        }

        const investment = this.investmentsRepository.create({
            ...createInvestmentDto,
            investorId: userId,
        });

        return this.investmentsRepository.save(investment);
    }

    async findAll(userId: string, userRole: UserRole): Promise<Investment[]> {
        // Si admin, retourner tous les investissements
        if (userRole === UserRole.ADMIN) {
            return this.investmentsRepository.find({
                relations: ['investor', 'project', 'project.owner'],
            });
        }

        // Sinon, retourner uniquement les investissements de l'utilisateur
        return this.investmentsRepository.find({
            where: { investorId: userId },
            relations: ['project', 'project.owner'],
        });
    }

    async findByProject(projectId: string, userId: string): Promise<Investment[]> {
        // Vérifier que le projet existe
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
        });

        if (!project) {
            throw new NotFoundException(`Projet avec ID ${projectId} non trouvé`);
        }

        // Si l'utilisateur est le propriétaire du projet, lui montrer tous les investissements
        if (project.ownerId === userId) {
            return this.investmentsRepository.find({
                where: { projectId },
                relations: ['investor'],
            });
        }

        // Sinon, montrer uniquement les investissements de l'utilisateur
        return this.investmentsRepository.find({
            where: { projectId, investorId: userId },
        });
    }

    async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
        const investment = await this.investmentsRepository.findOne({
            where: { id },
            relations: ['project'],
        });

        if (!investment) {
            throw new NotFoundException(`Investissement avec ID ${id} non trouvé`);
        }

        // Seul l'investisseur peut annuler son investissement
        if (investment.investorId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException(`Vous n'êtes pas autorisé à annuler cet investissement`);
        }

        await this.investmentsRepository.delete(id);
    }
}