// 4. Create Interest DTO (create-interest.dto.ts)
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInterestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}
