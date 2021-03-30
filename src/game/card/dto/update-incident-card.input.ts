import { InputType, PartialType } from '@nestjs/graphql';
import { CreateIncidentCardInput } from 'src/game/card/dto/create-incident-card.input';

@InputType()
export class UpdateIncidentCardInput extends PartialType(CreateIncidentCardInput) {}
