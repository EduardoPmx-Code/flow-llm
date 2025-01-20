import { Module } from '@nestjs/common';
import { LayersIaService } from './layers-ia.service';
import { ProductsLayerIaService } from './products-layer-ia';

@Module({
  controllers: [],
  providers: [LayersIaService, ProductsLayerIaService],
  exports: [LayersIaService],
})
export class LayersIaModule {}
