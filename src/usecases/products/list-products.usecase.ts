import { Injectable, Inject } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Utils */
import { createPaginatedResult } from 'src/common/pagination.utils';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const total = await this.productsRepo.countAll();
    const data = await this.productsRepo.findAll(page, limit);

    return createPaginatedResult(data, total, page, limit);
  }
}
