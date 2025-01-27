import { Injectable, Inject, NotFoundException } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(productName: string): Promise<string> {
    const product = await this.productsRepo.findByName(productName);

    if (!product) {
      throw new NotFoundException(
        `Produto com nome "${productName}" não encontrado.`,
      );
    }

    await this.productsRepo.delete(product.id);

    return product.name;
  }
}
