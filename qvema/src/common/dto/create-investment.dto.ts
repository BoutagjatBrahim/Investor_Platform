// 4. Create Investment DTO (create-investment.dto.ts)
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInvestmentDto {
    @IsNumber()
    @Min(0)
    amount: number;

    @IsUUID()
    @IsNotEmpty()
    projectId: string;
}