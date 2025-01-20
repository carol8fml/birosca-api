import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({
    description:
      'Quantidade a ser alterada no estoque. Deve ser um número inteiro positivo.',
    example: 2,
  })
  @IsInt({ message: 'A mudança de quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A mudança de quantidade deve ser pelo menos 1.' })
  quantityChange: number;
}
