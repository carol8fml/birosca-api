import { Injectable } from '@nestjs/common';

/** Repositories */
import { ProductsRepository } from './interfaces/products.repository';

/** entities */
import { Product } from '../../entities/product.entity';

/** Data */
import { DatabaseConfig } from '../../config/database.config';

/** Utils */
import { normalizeString } from 'src/common/string.utils';

interface ProductRow {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface FilterCriteria {
  category?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable()
export class SQLiteProductsRepo implements ProductsRepository {
  constructor(private readonly dbConfig: DatabaseConfig) {}

  /**
   * Converte um registro do banco de dados em uma entidade `Product`.
   * @param row O registro do banco de dados a ser convertido.
   */
  private mapRowToProduct(row: ProductRow): Product {
    return new Product(row.id, row.name, row.category, row.price, row.quantity);
  }

  /**
   * Executa uma consulta SQL genérica no banco de dados.
   * @param query A consulta SQL a ser executada.
   * @param params Os parâmetros da consulta.
   */
  private async runQuery<T>(
    query: string,
    params: (string | number | null)[] = [],
  ): Promise<T> {
    console.log('Executing Query:', query);
    console.log('With Params:', params);

    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, result) => {
        if (err) {
          console.error('Query Error:', err);
          reject(err);
        } else {
          resolve(result as T);
        }
      });
    });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Product[]> {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM products LIMIT ? OFFSET ?`;

    const rows: ProductRow[] = await this.runQuery(query, [limit, offset]);
    return rows.map(this.mapRowToProduct);
  }

  async countAll(): Promise<number> {
    const query = `SELECT COUNT(*) as total FROM products`;
    const result = await this.runQuery<{ total: number }[]>(query);
    return result[0]?.total || 0;
  }

  async findById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const rows: ProductRow[] = await this.runQuery(query, [id]);
    return rows.length > 0 ? this.mapRowToProduct(rows[0]) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const normalizedName = normalizeString(name);
    const query = 'SELECT * FROM products WHERE LOWER(name) = LOWER(?)';
    const rows: ProductRow[] = await this.runQuery(query, [normalizedName]);
    return rows.length > 0 ? this.mapRowToProduct(rows[0]) : null;
  }

  async save(product: Product): Promise<Product> {
    const query =
      'INSERT INTO products (name, category, price, quantity) VALUES (?, ?, ?, ?)';
    const params: (string | number | null)[] = [
      normalizeString(product.name),
      normalizeString(product.category),
      product.price,
      product.quantity,
    ];

    const db = this.dbConfig.getDatabase();
    await new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) reject(err);
        else {
          product.id = this.lastID;
          resolve(product);
        }
      });
    });

    return product;
  }

  async update(id: number, product: Product): Promise<Product> {
    const query =
      'UPDATE products SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
    const params: (string | number | null)[] = [
      normalizeString(product.name),
      normalizeString(product.category),
      product.price,
      product.quantity,
      id,
    ];

    await this.runQuery(query, params);
    return product;
  }

  async delete(id: number): Promise<void> {
    const query = 'DELETE FROM products WHERE id = ?';
    await this.runQuery(query, [id]);
  }

  async filter(criteria: FilterCriteria): Promise<Product[]> {
    const conditions: string[] = [];
    const params: (string | number | null)[] = [];

    const filters: { [key: string]: string | number | null } = {
      'LOWER(category) = LOWER(?)':
        criteria.category && normalizeString(criteria.category),
      'quantity >= ?': criteria.minQuantity,
      'quantity <= ?': criteria.maxQuantity,
      'price >= ?': criteria.minPrice,
      'price <= ?': criteria.maxPrice,
    };

    for (const [condition, value] of Object.entries(filters)) {
      if (value !== undefined) {
        conditions.push(condition);
        params.push(value);
      }
    }

    const query = `SELECT * FROM products WHERE 1=1 ${
      conditions.length ? 'AND ' + conditions.join(' AND ') : ''
    }`;

    const rows: ProductRow[] = await this.runQuery(query, params);
    return rows.map(this.mapRowToProduct);
  }
}
