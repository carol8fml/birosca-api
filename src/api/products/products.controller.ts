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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

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
import { UpdateProductDto } from './dto/update-products.dto';
import { ListProductsDto } from './dto/list-products.dto';

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
  @ApiOperation({ summary: 'Obter lista de produtos' })
  @ApiResponse({
    status: 200,
    description:
      'Retornou a lista de produtos com base na paginação fornecida.',
  })
  async getAllProducts(@Query() pagination: ListProductsDto) {
    const { page, limit } = pagination;
    return this.listProductsUseCase.execute(page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Adicionou o produto com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Alguns dos dados enviados estavam incorretos. A solicitação foi rejeitada.',
  })
  @ApiBody({
    description: 'Informações do produto a ser adicionado.',
    type: CreateProductDto,
  })
  async createProduct(@Body() productData: CreateProductDto) {
    return this.addProductUseCase.execute(productData);
  }

  @Post('/bulk')
  @ApiOperation({ summary: 'Adicionar vários produtos ao mesmo tempo' })
  @ApiResponse({
    status: 201,
    description: 'Adicionou os produtos com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Alguns ou todos os produtos possuíam dados inválidos. A solicitação foi rejeitada.',
  })
  @ApiBody({
    description:
      'Envie um array com as informações de cada produto. Todos devem seguir o formato do DTO de criação.',
    type: [CreateProductDto],
  })
  async createMultipleProducts(@Body() productsData: CreateProductDto[]) {
    return Promise.all(
      productsData.map((productData) =>
        this.addProductUseCase.execute(productData),
      ),
    );
  }

  @Get('/filter')
  @ApiOperation({ summary: 'Buscar produtos com filtros' })
  @ApiResponse({
    status: 200,
    description: 'Retornou os produtos que atendem aos filtros aplicados.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Os parâmetros enviados para o filtro estavam inválidos. A solicitação foi rejeitada.',
  })
  async filterProducts(@Query() filters: FilterProductsDto) {
    return this.filterProductsUseCase.execute(filters);
  }

  @Delete(':name')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remover um produto pelo nome' })
  @ApiResponse({
    status: 200,
    description: 'Removeu o produto com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'O produto com o nome especificado não foi encontrado.',
  })
  async deleteProduct(
    @Param('name') name: string,
  ): Promise<{ message: string }> {
    const productName = await this.deleteProductUseCase.execute(name);

    return { message: `O produto "${productName}" foi removido com sucesso.` };
  }

  @Put(':name')
  @ApiOperation({ summary: 'Atualizar informações de um produto' })
  @ApiResponse({
    status: 200,
    description: 'Atualizou as informações do produto com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Os dados enviados para atualização estavam incorretos. A solicitação foi rejeitada.',
  })
  @ApiResponse({
    status: 404,
    description: 'O produto com o nome especificado não foi encontrado.',
  })
  @ApiBody({
    description: 'Dados atualizados para o produto.',
    type: UpdateProductDto,
  })
  async updateProduct(
    @Param('name') name: string,
    @Body() updateData: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProductUseCase.execute(name, updateData);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Buscar informações de um produto pelo nome' })
  @ApiResponse({
    status: 200,
    description: 'Retornou as informações do produto solicitado.',
  })
  @ApiResponse({
    status: 404,
    description: 'O produto com o nome especificado não foi encontrado.',
  })
  async getProductByName(@Param('name') name: string): Promise<Product> {
    return this.getProductByNameUseCase.execute(name);
  }
}
