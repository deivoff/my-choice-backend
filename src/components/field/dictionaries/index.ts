import { FieldType } from '$components/field';

import SITUATIONS from './situations';
import OFFERS from './offers';
import INCIDENTS from './incidents';
import OPPORTUNITIES from './opportunities';
import REACTIONS from './reactions';
import DREAMS from './dreams';

export const FIELDS = {
  [FieldType.offer]: OFFERS,
  [FieldType.incident]: INCIDENTS,
  [FieldType.opportunity]: OPPORTUNITIES,
  [FieldType.situation]: SITUATIONS,
  [FieldType.reaction]: REACTIONS,
  [FieldType.dream]: DREAMS
};