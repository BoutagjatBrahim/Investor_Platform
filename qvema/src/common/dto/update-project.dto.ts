// 5. Update Project DTO (update-project.dto.ts)
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProjectDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    budget?: number;

    @IsString()
    @IsOptional()
    category?: string;
}