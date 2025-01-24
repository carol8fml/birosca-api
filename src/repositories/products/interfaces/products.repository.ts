import { Product } from '../../../entities/product.entity';

export interface ProductsRepository {
  /**
   * Retorna todos os produtos.
   * @param page Página atual.
   * @param limit Quantidade de itens por página (opcional).
   */
  findAll(page?: number, limit?: number): Promise<Product[]>;

  /**
   * Retorna o número total de produtos no banco de dados.
   */
  countAll(): Promise<number>;

  /**
   * Retorna um produto pelo ID.
   * @param id ID do produto
   */
  findById(id: number): Promise<Product | null>;

  /**
   * Retorna um produto pelo nome.
   * @param name Nome do produto
   */
  findByName(name: string): Promise<Product | null>;

  /**
   * Salva um novo produto no banco de dados.
   * @param product Instância da entidade Product
   */
  save(product: Product): Promise<Product>;

  /**
   * Atualiza um produto existente.
   * @param id ID do produto a ser atualizado
   * @param product Dados atualizados do produto
   */
  update(id: number, product: Product): Promise<Product>;

  /**
   * Remove um produto pelo ID.
   * @param id ID do produto
   */
  delete(id: number): Promise<void>;

  /**
   * Filtra produtos com base em critérios.
   * @param criteria Critérios de filtro
   */
  filter(criteria: {
    category?: string;
    minQuantity?: number;
    maxQuantity?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]>;
}
