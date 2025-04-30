// projects.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, User]), // Important pour l'injection des repositories
    ],
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService], // Si d'autres modules ont besoin d'y accéder
})
export class ProjectsModule { }