import { Injectable } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';

@Injectable()
export class DatabaseConfig {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./birosca.db', (err) => {
      if (err) {
        console.error('Erro ao conectar ao SQLite:', err);
      } else {
        console.log('Conectado ao SQLite com sucesso.');
        this.initializeSchema();
      }
    });
  }

  private initializeSchema() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL
      );
    `;
    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Erro ao criar tabela products:', err);
      } else {
        console.log('Tabela products pronta.');
      }
    });
  }

  getDatabase(): sqlite3.Database {
    return this.db;
  }
}
