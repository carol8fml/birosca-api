import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/** Uses Cases */
import { ListProductsUseCase } from '../../usecases/products/list-products.usecase';
import { AddProductUseCase } from '../../usecases/products/add-product.usecase';

/** DTO */
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly addProductUseCase: AddProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
  })
  async getAllProducts() {
    return this.listProductsUseCase.execute();
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar um produto' })
  @ApiResponse({ status: 201, description: 'Produto adicionado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async createProduct(@Body() productData: CreateProductDto) {
    return this.addProductUseCase.execute(productData);
  }
}
