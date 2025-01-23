import { NotFoundException } from '@nestjs/common';

/** Repositories  */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Entities */
import { Product } from 'src/entities/product.entity';

/** Use cases */
import { DeleteProductUseCase } from 'src/usecases/products/delete-product.usecase';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      findByName: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new DeleteProductUseCase(mockRepo);
  });

  it('Deve deletar um produto existente', async () => {
    const product = new Product(1, 'Arroz', 'Alimentos', 10, 100);
    mockRepo.findByName.mockResolvedValue(product);
    mockRepo.delete.mockResolvedValue();

    const result = await useCase.execute('Arroz');

    expect(result).toBe('Arroz');
    expect(mockRepo.findByName).toHaveBeenCalledWith('Arroz');
    expect(mockRepo.delete).toHaveBeenCalledWith(product.id);
  });

  it('Deve lançar erro para produto inexistente', async () => {
    mockRepo.findByName.mockResolvedValue(null);

    await expect(useCase.execute('Arroz')).rejects.toThrow(NotFoundException);
  });
});
