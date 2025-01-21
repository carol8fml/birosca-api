import { Injectable, Inject, NotFoundException } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

@Injectable()
export class GetProductByNameUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(productName: string): Promise<Product> {
    const product = await this.productsRepo.findByName(productName);

    if (!product) {
      throw new NotFoundException(
        `Produto com nome "${productName}" não encontrado.`,
      );
    }

    return product;
  }
}
