import { Field, InputType } from '@nestjs/graphql';
import { ResourceType } from 'src/game/resources/resources.entity';

@InputType()
export class ShareResourcesInput {

  @Field(() => ResourceType)
  exchange: ResourceType;

  @Field(() => ResourceType)
  for: ResourceType

}
