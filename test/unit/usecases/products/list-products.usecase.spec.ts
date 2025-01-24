/** Entities */
import { Product } from 'src/entities/product.entity';

/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Use cases */
import { ListProductsUseCase } from 'src/usecases/products/list-products.usecase';

/** Utils */
import { createPaginatedResult } from 'src/common/pagination.utils';

const allProducts = [
  new Product(1, 'Arroz', 'Alimentos', 10, 100),
  new Product(2, 'Feijão', 'Alimentos', 15, 50),
  new Product(3, 'Macarrão', 'Alimentos', 12, 20),
  new Product(4, 'Açúcar', 'Alimentos', 8, 40),
];

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      countAll: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new ListProductsUseCase(mockRepo);
  });

  it('Deve retornar a primeira página de produtos', async () => {
    mockRepo.countAll.mockResolvedValue(allProducts.length);
    mockRepo.findAll.mockResolvedValue(allProducts.slice(0, 2));

    const result = await useCase.execute(1, 2);

    expect(result).toEqual(
      createPaginatedResult(allProducts.slice(0, 2), allProducts.length, 1, 2),
    );
    expect(mockRepo.countAll).toHaveBeenCalled();
    expect(mockRepo.findAll).toHaveBeenCalledWith(1, 2);
  });

  it('Deve retornar a segunda página de produtos', async () => {
    mockRepo.countAll.mockResolvedValue(allProducts.length);
    mockRepo.findAll.mockResolvedValue(allProducts.slice(2, 4));

    const result = await useCase.execute(2, 2);

    expect(result).toEqual(
      createPaginatedResult(allProducts.slice(2, 4), allProducts.length, 2, 2),
    );
    expect(mockRepo.countAll).toHaveBeenCalled();
    expect(mockRepo.findAll).toHaveBeenCalledWith(2, 2);
  });
});
