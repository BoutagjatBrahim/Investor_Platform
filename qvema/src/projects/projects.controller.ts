// 3. Project Controller (projects.controller.ts)
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from '../common/dto/create-project.dto';
import { UpdateProjectDto } from '../common/dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ENTREPRENEUR)
    create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
        return this.projectsService.create(createProjectDto, req.user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.projectsService.findAll();
    }

    @Get('recommended')
    @UseGuards(JwtAuthGuard)
    getRecommendedProjects(@Request() req) {
        return this.projectsService.getRecommendedProjects(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ENTREPRENEUR)
    update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @Request() req,
    ) {
        return this.projectsService.update(id, updateProjectDto, req.user.id, req.user.role);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
    remove(@Param('id') id: string, @Request() req) {
        return this.projectsService.remove(id, req.user.id, req.user.role);
    }
}
