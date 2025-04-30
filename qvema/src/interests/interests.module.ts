// src/interests/interests.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';
import { Interest } from './entities/interest.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Interest]),
    ],
    controllers: [InterestsController],
    providers: [InterestsService],
    exports: [InterestsService, TypeOrmModule.forFeature([Interest])],
})
export class InterestsModule { }