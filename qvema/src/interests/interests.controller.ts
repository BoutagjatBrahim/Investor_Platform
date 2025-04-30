// 3. Interest Controller (interests.controller.ts)
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from '../common/dto/create-interest.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('interests')
export class InterestsController {
    constructor(private readonly interestsService: InterestsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createInterestDto: CreateInterestDto) {
        return this.interestsService.create(createInterestDto);
    }

    @Get()
    findAll() {
        return this.interestsService.findAll();
    }
}
