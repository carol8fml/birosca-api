export class Product {
  constructor(
    /** Identificador único do produto */
    public id: number,
    /**  Nome do produto */
    public name: string,
    /**  Categoria do produto */
    public category: string, //
    /** Preço do produto */
    public price: number,
    /** Quantidade em estoque */
    public quantity: number,
  ) {}

  /**
   * Método para validar os dados do produto.
   * Pode ser usado antes de persistir os dados no banco.
   */
  isValid(): boolean {
    if (!this.name || this.name.trim() === '') {
      throw new Error('O nome do produto não pode estar vazio.');
    }

    if (this.price <= 0) {
      throw new Error('O preço do produto deve ser maior que zero.');
    }

    if (this.quantity < 0) {
      throw new Error('A quantidade do produto não pode ser negativa.');
    }

    return true;
  }
}
