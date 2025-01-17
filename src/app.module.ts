import { Module } from '@nestjs/common';

/** Controllers */
import { ProductsController } from './api/products/products.controller';

/** Use Cases */
import { ListProductsUseCase } from './usecases/products/list-products.usecase';
import { AddProductUseCase } from './usecases/products/add-product.usecase';

/** Repositories */
import { SQLiteProductsRepo } from './repositories/products/sqlite-products.repo';

/** Config */
import { DatabaseConfig } from './config/database.config';

@Module({
  controllers: [ProductsController],
  providers: [
    DatabaseConfig,
    SQLiteProductsRepo,
    { provide: 'ProductsRepository', useClass: SQLiteProductsRepo },
    ListProductsUseCase,
    AddProductUseCase,
  ],
})
export class AppModule {}
