import { Injectable } from '@nestjs/common';

/** Repository */
import { ProductsRepository } from './interfaces/products.repository';

/** Entity  */
import { Product } from '../../entities/product.entity';

/** Data */
import { DatabaseConfig } from '../../config/database.config';

/** Utils */
import { normalizeString } from 'src/utils/string.utils';

interface ProductRow {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

@Injectable()
export class SQLiteProductsRepo implements ProductsRepository {
  constructor(private readonly dbConfig: DatabaseConfig) {}

  async findAll(): Promise<Product[]> {
    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', [], (err, rows: ProductRow[]) => {
        if (err) {
          reject(err);
        } else {
          const products = rows.map(
            (row) =>
              new Product(
                row.id,
                row.name,
                row.category,
                row.price,
                row.quantity,
              ),
          );
          resolve(products);
        }
      });
    });
  }

  async findById(id: number): Promise<Product | null> {
    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err, row: ProductRow) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              row
                ? new Product(
                    row.id,
                    row.name,
                    row.category,
                    row.price,
                    row.quantity,
                  )
                : null,
            );
          }
        },
      );
    });
  }

  async findByName(name: string): Promise<Product | null> {
    const db = this.dbConfig.getDatabase();
    const normalizedName = normalizeString(name); // Normaliza a entrada
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE LOWER(name) = LOWER(?)',
        [normalizedName],
        (err, row: ProductRow) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              row
                ? new Product(
                    row.id,
                    row.name,
                    row.category,
                    row.price,
                    row.quantity,
                  )
                : null,
            );
          }
        },
      );
    });
  }

  async save(product: Product): Promise<Product> {
    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO products (name, category, price, quantity) VALUES (?, ?, ?, ?)';
      db.run(
        query,
        [
          normalizeString(product.name),
          normalizeString(product.category),
          product.price,
          product.quantity,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            product.id = this.lastID;
            resolve(product);
          }
        },
      );
    });
  }

  async update(id: number, product: Product): Promise<Product> {
    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      const query =
        'UPDATE products SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
      db.run(
        query,
        [product.name, product.category, product.price, product.quantity, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(product);
          }
        },
      );
    });
  }

  async delete(id: number): Promise<void> {
    const db = this.dbConfig.getDatabase();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async filter(criteria: {
    category?: string;
    minQuantity?: number;
    maxQuantity?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    const db = this.dbConfig.getDatabase();
    let query = `SELECT * FROM products WHERE 1=1`;
    const params: any[] = [];

    if (criteria.category) {
      query += ` AND LOWER(category) = LOWER(?)`;
      params.push(normalizeString(criteria.category));
    }
    if (criteria.minQuantity !== undefined) {
      query += ` AND quantity >= ?`;
      params.push(criteria.minQuantity);
    }
    if (criteria.maxQuantity !== undefined) {
      query += ` AND quantity <= ?`;
      params.push(criteria.maxQuantity);
    }
    if (criteria.minPrice !== undefined) {
      query += ` AND price >= ?`;
      params.push(criteria.minPrice);
    }
    if (criteria.maxPrice !== undefined) {
      query += ` AND price <= ?`;
      params.push(criteria.maxPrice);
    }

    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows: ProductRow[]) => {
        if (err) {
          reject(err);
        } else {
          const products = rows.map(
            (row) =>
              new Product(
                row.id,
                row.name,
                row.category,
                row.price,
                row.quantity,
              ),
          );
          resolve(products);
        }
      });
    });
  }
}
