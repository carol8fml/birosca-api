/** Entities */
import { Product } from 'src/entities/product.entity';

/** Repositories  */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Use cases */
import { FilterProductsUseCase } from 'src/usecases/products/filter-products.usecase';

describe('FilterProductsUseCase', () => {
  let useCase: FilterProductsUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      filter: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new FilterProductsUseCase(mockRepo);
  });

  it('Deve retornar produtos filtrados por categoria', async () => {
    const filters = { category: 'Alimentos' };
    const expectedProducts = [new Product(1, 'Arroz', 'Alimentos', 10, 100)];
    mockRepo.filter.mockResolvedValue(expectedProducts);

    const result = await useCase.execute(filters);

    expect(result).toEqual(expectedProducts);
    expect(mockRepo.filter).toHaveBeenCalledWith(filters);
  });

  it('Deve retornar uma lista vazia se nenhum produto corresponder', async () => {
    const filters = { category: 'Eletrônicos' };
    mockRepo.filter.mockResolvedValue([]);

    const result = await useCase.execute(filters);

    expect(result).toEqual([]);
  });
});
