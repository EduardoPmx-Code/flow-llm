import { Injectable } from '@nestjs/common';
import { ProductsLayerIaService } from './products-layer-ia';

@Injectable()
export class LayersIaService {
  constructor(private productsLayer: ProductsLayerIaService) {}
  async handlerProducts(prompt) {
    try {
      const response = await this.productsLayer.handlerRequestproducts(prompt);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
