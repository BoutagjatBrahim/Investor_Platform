// 5. User Controller (users.controller.ts)
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { UpdateUserDto } from '../common/dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(req.user.id, updateUserDto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Post('interests')
    @UseGuards(JwtAuthGuard)
    addInterests(@Request() req, @Body() body: { interestIds: string[] }) {
        return this.usersService.addInterests(req.user.id, body.interestIds);
    }

    @Get('interests')
    @UseGuards(JwtAuthGuard)
    getUserInterests(@Request() req) {
        return this.usersService.getUserInterests(req.user.id);
    }
}