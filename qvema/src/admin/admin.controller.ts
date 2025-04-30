// 5. Admin Controller (admin.controller.ts)
import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Delete('users/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    @Get('investments')
    getAllInvestments() {
        return this.adminService.getAllInvestments();
    }
}
