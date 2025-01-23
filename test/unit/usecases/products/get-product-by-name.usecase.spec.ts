import { NotFoundException } from '@nestjs/common';

/** Entities */
import { Product } from 'src/entities/product.entity';

/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Use cases */
import { GetProductByNameUseCase } from 'src/usecases/products/get-product-by-name.usecase';

describe('GetProductByNameUseCase', () => {
  let useCase: GetProductByNameUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      findByName: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new GetProductByNameUseCase(mockRepo);
  });

  it('Deve retornar um produto existente', async () => {
    const product = new Product(1, 'Arroz', 'Alimentos', 10, 100);
    mockRepo.findByName.mockResolvedValue(product);

    const result = await useCase.execute('Arroz');

    expect(result).toEqual(product);
    expect(mockRepo.findByName).toHaveBeenCalledWith('Arroz');
  });

  it('Deve lançar erro para produto inexistente', async () => {
    mockRepo.findByName.mockResolvedValue(null);

    await expect(useCase.execute('Arroz')).rejects.toThrow(NotFoundException);
  });
});
