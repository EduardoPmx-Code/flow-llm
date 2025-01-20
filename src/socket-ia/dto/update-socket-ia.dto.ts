import { PartialType } from '@nestjs/mapped-types';
import { CreateSocketIaDto } from './create-socket-ia.dto';

export class UpdateSocketIaDto extends PartialType(CreateSocketIaDto) {
  id: number;
}
