// investments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './investments.service';
import { Investment } from './entities/investment.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Investment, Project, User]),
    ],
    controllers: [InvestmentsController],
    providers: [InvestmentsService],
    exports: [InvestmentsService], // Optionnel si d'autres modules ont besoin d'y accéder
})
export class InvestmentsModule { }