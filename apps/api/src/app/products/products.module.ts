import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// controllers
import { ProductsController } from './products.controller';
// services
import { ProductsService } from './products.service';
// schema
import { ProductSchema } from './product.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
