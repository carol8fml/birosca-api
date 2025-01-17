import { Injectable, Inject } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

@Injectable()
export class AddProductUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }): Promise<Product> {
    const product = new Product(
      0,
      data.name,
      data.category,
      data.price,
      data.quantity,
    );

    product.isValid();

    return this.productsRepo.save(product);
  }
}
