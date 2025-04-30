// 4. Create Project DTO (create-project.dto.ts)
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    budget: number;

    @IsString()
    @IsNotEmpty()
    category: string;
}
