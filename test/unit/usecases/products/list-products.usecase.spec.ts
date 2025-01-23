/** Entities */
import { Product } from 'src/entities/product.entity';

/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Use cases */
import { ListProductsUseCase } from 'src/usecases/products/list-products.usecase';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new ListProductsUseCase(mockRepo);
  });

  it('Deve retornar todos os produtos', async () => {
    const products = [
      new Product(1, 'Arroz', 'Alimentos', 10, 100),
      new Product(2, 'Feijão', 'Alimentos', 15, 50),
    ];
    mockRepo.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result).toEqual(products);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('Deve retornar uma lista vazia se não houver produtos', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
