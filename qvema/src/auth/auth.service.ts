import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from '../common/dto/register.dto';
import { LoginDto } from '../common/dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<User> {
        const { email, password, role } = registerDto;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Cet email est déjà utilisé');
        }

        // Créer un nouvel utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            id: uuidv4(),
            email,
            password: hashedPassword,
            role,
        });

        return this.usersRepository.save(user);
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Identifiants invalides');
        }

        const payload = { id: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }
}