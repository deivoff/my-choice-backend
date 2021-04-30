import { Module } from '@nestjs/common';
import { ObjectIdScalar } from './scalars/objectId.scalar';

@Module({
  providers: [ObjectIdScalar],
})
export class CommonModule {}
