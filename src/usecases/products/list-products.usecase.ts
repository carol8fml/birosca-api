import { Injectable, Inject } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productsRepo.findAll();
  }
}
