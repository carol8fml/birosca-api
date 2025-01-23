/** Repositories */
import { ProductsRepository } from 'src/repositories/products/interfaces/products.repository';

/** Use cases */
import { AddProductUseCase } from 'src/usecases/products/add-product.usecase';

/** Entities */
import { Product } from 'src/entities/product.entity';

describe('AddProductUseCase', () => {
  let useCase: AddProductUseCase;
  let mockRepo: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;
    useCase = new AddProductUseCase(mockRepo);
  });

  it('Deve salvar um produto válido', async () => {
    const data = {
      name: 'Arroz',
      category: 'Alimentos',
      price: 10,
      quantity: 100,
    };
    const expectedProduct = new Product(
      0,
      data.name,
      data.category,
      data.price,
      data.quantity,
    );

    mockRepo.save.mockResolvedValue(expectedProduct);

    const result = await useCase.execute(data);

    expect(result).toEqual(expectedProduct);
    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
      }),
    );
  });

  it('Deve lançar erro para produto com preço inválido', async () => {
    const data = {
      name: 'Arroz',
      category: 'Alimentos',
      price: -10,
      quantity: 100,
    };

    await expect(useCase.execute(data)).rejects.toThrow(
      'O preço do produto deve ser maior que zero.',
    );
  });
});
