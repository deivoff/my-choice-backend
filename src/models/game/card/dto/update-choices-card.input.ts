import { InputType, PartialType } from '@nestjs/graphql';
import { CreateChoicesCardInput } from 'src/models/game/card/dto/create-choices-card.input';

@InputType()
export class UpdateChoicesCardInput extends PartialType(CreateChoicesCardInput) {}
