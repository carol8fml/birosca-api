import { Injectable, Inject } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

interface FilterCriteria {
  category?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class FilterProductsUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(filters: FilterCriteria): Promise<Product[]> {
    return this.productsRepo.filter(filters);
  }
}
