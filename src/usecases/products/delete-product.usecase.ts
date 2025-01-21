import { Injectable, Inject, NotFoundException } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}
  async execute(productId: number): Promise<string> {
    const product = await this.productsRepo.findById(productId);

    if (!product) {
      throw new NotFoundException(
        `Produto com ID ${productId} não encontrado.`,
      );
    }

    await this.productsRepo.delete(productId);

    return product.name;
  }
}
