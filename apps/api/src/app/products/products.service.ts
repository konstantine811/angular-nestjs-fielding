import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// model
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const product = {
      title,
      description: desc,
      price,
    };
    const newProduct = new this.productModel(product);
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const result = await this.productModel.find().exec();
    return result.map((prod) => ({
      id: prod._id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return {
      id: product._id,
      title: product.title,
      descriptioin: product.description,
      price: product.price,
    };
  }

  async deleteProdcut(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number
  ) {
    const updateProduct = await this.findProduct(productId);
    if (title) {
      updateProduct.title = title;
    }
    if (desc) {
      updateProduct.description = desc;
    }
    if (price) {
      updateProduct.price = price;
    }
    await updateProduct.save();
    return updateProduct;
  }

  private async findProduct(id: string) {
    let product;
    try {
      product = await this.productModel.findById(id).exec();
    } catch (e) {
      throw new NotFoundException('Could not find product.');
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
