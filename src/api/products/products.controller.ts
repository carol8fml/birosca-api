import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/** Use Cases */
import { ListProductsUseCase } from '../../usecases/products/list-products.usecase';
import { AddProductUseCase } from '../../usecases/products/add-product.usecase';
import { FilterProductsUseCase } from '../../usecases/products/filter-products.usecase';
import { DeleteProductUseCase } from '../../usecases/products/delete-product.usecase';
import { UpdateProductUseCase } from '../../usecases/products/update-product.usecase';
import { GetProductByNameUseCase } from '../../usecases/products/get-product-by-name.usecase';

/** DTOs */
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/** Entities */
import { Product } from '../../entities/product.entity';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly addProductUseCase: AddProductUseCase,
    private readonly filterProductsUseCase: FilterProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly getProductByNameUseCase: GetProductByNameUseCase,
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

  @Delete(':name')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletar um produto por nome' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async deleteProduct(
    @Param('name') name: string,
  ): Promise<{ message: string }> {
    const productName = await this.deleteProductUseCase.execute(name);

    return { message: `O produto "${productName}" foi deletado com sucesso.` };
  }

  @Put(':name')
  @ApiOperation({ summary: 'Atualizar um produto por nome' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async updateProduct(
    @Param('name') name: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProductUseCase.execute(name, updateData);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Obter um produto por nome' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async getProductByName(@Param('name') name: string): Promise<Product> {
    return this.getProductByNameUseCase.execute(name);
  }
}
