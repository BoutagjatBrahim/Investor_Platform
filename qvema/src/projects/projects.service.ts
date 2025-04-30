// 2. Project Service (projects.service.ts)
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from '../common/dto/create-project.dto';
import { UpdateProjectDto } from '../common/dto/update-project.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
        // Vérifier que l'utilisateur est un entrepreneur
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user || user.role !== UserRole.ENTREPRENEUR) {
            throw new ForbiddenException('Seuls les entrepreneurs peuvent créer des projets');
        }

        const project = this.projectsRepository.create({
            ...createProjectDto,
            ownerId: userId,
        });

        return this.projectsRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.projectsRepository.find({ relations: ['owner'] });
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['owner', 'investments', 'investments.investor'],
        });

        if (!project) {
            throw new NotFoundException(`Projet avec ID ${id} non trouvé`);
        }

        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, userRole: UserRole): Promise<Project> {
        const project = await this.findOne(id);

        // Vérifier que c'est bien le créateur qui modifie
        if (project.ownerId !== userId) {
            throw new ForbiddenException(`Vous n'êtes pas autorisé à modifier ce projet`);
        }

        const updatedProject = { ...project, ...updateProjectDto };

        return this.projectsRepository.save(updatedProject);
    }

    async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
        const project = await this.findOne(id);

        // Un admin ou le propriétaire peut supprimer
        if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
            throw new ForbiddenException(`Vous n'êtes pas autorisé à supprimer ce projet`);
        }

        await this.projectsRepository.delete(id);
    }

    // async getRecommendedProjects(userId: string): Promise<Project[]> {
    //     const user = await this.usersRepository.findOne({
    //         where: { id: userId },
    //         relations: ['interests'],
    //     });

    //     if (!user) {
    //         throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    //     }

    //     // Si l'utilisateur n'a pas d'intérêts, on retourne tous les projets
    //     if (!user.interests || user.interests.length === 0) {
    //         return this.findAll();
    //     }

    //     // Récupérer les IDs des intérêts de l'utilisateur
    //     const interestIds = user.interests.map(interest => interest.id);

    //     // Requête pour trouver les projets correspondant aux intérêts
    //     // Note: Cette requête est simplifiée. Dans un système réel, on ferait une 
    //     // correspondance plus sophistiquée entre les catégories de projets et les intérêts
    //     const projects = await this.projectsRepository
    //         .createQueryBuilder('project')
    //         .leftJoinAndSelect('project.owner', 'owner')
    //         .where('project.category IN (:...interestIds)', { interestIds })
    //         .getMany();

    //     return projects;
    // }
    async getRecommendedProjects(userId: string): Promise<Project[]> {
        // Trouver l'utilisateur avec ses intérêts
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['interests'],
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
        }

        // Si l'utilisateur n'a pas d'intérêts, on retourne tous les projets
        if (!user.interests || user.interests.length === 0) {
            return this.findAll();
        }

        // Récupérer les NOMS des intérêts de l'utilisateur (au lieu des IDs)
        const interestNames = user.interests.map(interest => interest.name);

        console.log('Intérêts de l\'utilisateur:', interestNames); // Pour déboguer

        // Requête pour trouver les projets correspondant aux intérêts
        const projects = await this.projectsRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.owner', 'owner')
            .where('project.category IN (:...interestNames)', { interestNames })
            .getMany();

        console.log('Projets recommandés trouvés:', projects.length); // Pour déboguer

        return projects;
    }
}
