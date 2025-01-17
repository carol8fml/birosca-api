import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Arroz', description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Alimentos', description: 'Categoria do produto' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 10.5, description: 'Preço do produto' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Quantidade disponível no estoque',
  })
  @IsNumber()
  quantity: number;
}
