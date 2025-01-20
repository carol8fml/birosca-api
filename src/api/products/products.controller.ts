import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/** Use Cases */
import { ListProductsUseCase } from '../../usecases/products/list-products.usecase';
import { AddProductUseCase } from '../../usecases/products/add-product.usecase';
import { FilterProductsUseCase } from '../../usecases/products/filter-products.usecase';
import { ManageStockUseCase } from '../../usecases/products/manage-stock.usecase';

/** DTOs */
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly addProductUseCase: AddProductUseCase,
    private readonly filterProductsUseCase: FilterProductsUseCase,
    private readonly manageStockUseCase: ManageStockUseCase,
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

  @Post('/bulk')
  @ApiOperation({ summary: 'Adicionar múltiplos produtos' })
  @ApiResponse({
    status: 201,
    description: 'Produtos adicionados com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async createMultipleProducts(@Body() productsData: CreateProductDto[]) {
    return Promise.all(
      productsData.map((productData) =>
        this.addProductUseCase.execute(productData),
      ),
    );
  }

  @Get('/filter')
  @ApiOperation({ summary: 'Filtrar produtos por critérios' })
  @ApiResponse({
    status: 200,
    description: 'Produtos filtrados retornados com sucesso.',
  })
  async filterProducts(@Query() filters: FilterProductsDto) {
    return this.filterProductsUseCase.execute(filters);
  }

  @Patch(':id/stock/add')
  @ApiOperation({ summary: 'Aumentar o estoque de um produto' })
  @ApiResponse({
    status: 200,
    description: 'Quantidade adicionada ao estoque com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async addStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStockDto,
  ) {
    return this.manageStockUseCase.execute(id, body.quantityChange);
  }

  @Patch(':id/stock/remove')
  @ApiOperation({ summary: 'Diminuir o estoque de um produto' })
  @ApiResponse({
    status: 200,
    description: 'Quantidade removida do estoque com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Quantidade em estoque insuficiente.',
  })
  async removeStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStockDto,
  ) {
    return this.manageStockUseCase.execute(id, -body.quantityChange);
  }
}
