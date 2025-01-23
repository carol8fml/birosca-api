import { NotFoundException } from '@nestjs/common';

/** Entities */
import { Product } from 'src/entities/product.entity';

/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Usecases */
import { UpdateProductUseCase } from 'src/usecases/products/update-product.usecase';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      findByName: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new UpdateProductUseCase(mockRepo);
  });

  it('Deve atualizar um produto existente', async () => {
    const product = new Product(1, 'Arroz', 'Alimentos', 10, 100);
    const updatedProduct = new Product(
      1,
      'Arroz Integral',
      'Alimentos',
      12,
      90,
    );

    mockRepo.findByName.mockResolvedValue(product);
    mockRepo.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('Arroz', {
      name: 'Arroz Integral',
      price: 12,
      quantity: 90,
    });

    expect(result).toEqual(updatedProduct);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Arroz');
    expect(mockRepo.update).toHaveBeenCalledWith(product.id, updatedProduct);
  });

  it('Deve lançar erro para produto inexistente', async () => {
    mockRepo.findByName.mockResolvedValue(null);

    await expect(useCase.execute('Arroz', { price: 12 })).rejects.toThrow(
      NotFoundException,
    );
  });
});
