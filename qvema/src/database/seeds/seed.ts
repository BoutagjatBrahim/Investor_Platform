// src/database/seeds/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../../users/entities/user.entity';
import { Interest } from '../../interests/entities/interest.entity';
import { Project } from '../../projects/entities/project.entity';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
        // Attendre que les connexions soient établies
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Obtenir le DataSource via l'injection de dépendances NestJS
        const dataSource = app.get(DataSource);

        // Vérifier l'état de la connexion
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }

        console.log('✅ Connexion à la base de données établie');

        // Obtenir les repositories
        const interestRepository = dataSource.getRepository(Interest);
        const userRepository = dataSource.getRepository(User);
        const projectRepository = dataSource.getRepository(Project);

        // Création des intérêts
        const interests = await interestRepository.save([
            { name: 'Technologie', description: 'Projets de technologie et d\'innovation' },
            { name: 'Écologie', description: 'Projets écologiques et durables' },
            { name: 'Finance', description: 'Projets dans le domaine financier' },
            { name: 'Santé', description: 'Projets liés à la santé et au bien-être' },
            { name: 'Éducation', description: 'Projets éducatifs' },
        ]);

        console.log('✅ Intérêts créés avec succès');

        // Admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await userRepository.save({
            id: uuidv4(),
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            password: adminPassword,
            role: UserRole.ADMIN,
            interests: [interests[0], interests[1]],
        });

        console.log('✅ Admin créé avec succès');

        // Entrepreneur
        const entrepreneurPassword = await bcrypt.hash('entrepreneur123', 10);
        const entrepreneur = await userRepository.save({
            id: uuidv4(),
            email: 'entrepreneur@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: entrepreneurPassword,
            role: UserRole.ENTREPRENEUR,
            interests: [interests[0], interests[2]],
        });

        console.log('✅ Entrepreneur créé avec succès');

        // Investisseur
        const investorPassword = await bcrypt.hash('investor123', 10);
        const investor = await userRepository.save({
            id: uuidv4(),
            email: 'investor@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            password: investorPassword,
            role: UserRole.INVESTOR,
            interests: [interests[1], interests[3]],
        });

        console.log('✅ Investisseur créé avec succès');

        // Création des projets
        await projectRepository.save([
            {
                title: 'Application mobile écologique',
                description: 'Une application qui permet de suivre son empreinte carbone',
                budget: 50000,
                category: 'Écologie',
                ownerId: entrepreneur.id,
            },
            {
                title: 'Plateforme d\'investissement',
                description: 'Une plateforme pour faciliter les investissements dans les startups',
                budget: 75000,
                category: 'Finance',
                ownerId: entrepreneur.id,
            },
        ]);

        console.log('✅ Projets créés avec succès');
        console.log('✅ Base de données initialisée avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
        console.error(error.stack);
    } finally {
        await app.close();
    }
}

seed();