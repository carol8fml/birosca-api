import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FilterProductsDto {
  @ApiPropertyOptional({
    example: 'Alimentos',
    description: 'Categoria do produto',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  category?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Quantidade mínima em estoque',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Quantidade máxima em estoque',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxQuantity?: number;

  @ApiPropertyOptional({ example: 10, description: 'Preço mínimo' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 100, description: 'Preço máximo' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
