import { Injectable, Inject, NotFoundException } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(
    productName: string,
    updateData: Partial<Product>,
  ): Promise<Product> {
    const product = await this.productsRepo.findByName(productName);

    if (!product) {
      throw new NotFoundException(
        `Produto com nome "${productName}" não encontrado.`,
      );
    }

    Object.assign(product, updateData);

    return this.productsRepo.update(product.id, product);
  }
}
