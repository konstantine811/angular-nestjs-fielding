import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// controller
import { AppController } from './app.controller';
// services
import { AppService } from './app.service';
// modules
import { ProductsModule } from './products/products.module';
import { PointsModule } from './points/points.module';
@Module({
  imports: [
    ProductsModule,
    PointsModule,
    MongooseModule.forRoot(
      'mongodb+srv://const:12345@cluster0.kh6da.mongodb.net/fielding?retryWrites=true&w=majority'
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
