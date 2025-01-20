import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from '../../repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from '../../entities/product.entity';

@Injectable()
export class ManageStockUseCase {
  constructor(
    @Inject('ProductsRepository')
    private readonly productsRepo: ProductsRepository,
  ) {}

  async execute(id: number, quantityChange: number): Promise<Product> {
    const product = await this.productsRepo.findById(id);

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    const newQuantity = product.quantity + quantityChange;

    if (newQuantity < 0) {
      throw new BadRequestException(
        'A quantidade em estoque não pode ser negativa.',
      );
    }

    product.quantity = newQuantity;

    return this.productsRepo.update(id, product);
  }
}
