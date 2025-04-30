// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Interest]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule { }