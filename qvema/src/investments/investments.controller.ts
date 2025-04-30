// 3. Investment Controller (investments.controller.ts)
import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from '../common/dto/create-investment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('investments')
export class InvestmentsController {
    constructor(private readonly investmentsService: InvestmentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.INVESTOR)
    create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req) {
        return this.investmentsService.create(createInvestmentDto, req.user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req) {
        return this.investmentsService.findAll(req.user.id, req.user.role);
    }

    @Get('project/:id')
    @UseGuards(JwtAuthGuard)
    findByProject(@Param('id') projectId: string, @Request() req) {
        return this.investmentsService.findByProject(projectId, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.investmentsService.remove(id, req.user.id, req.user.role);
    }
}