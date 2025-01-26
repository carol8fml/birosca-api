import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Arroz', description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 'Alimentos', description: 'Categoria do produto' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 10.5, description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Quantidade disponível no estoque',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
