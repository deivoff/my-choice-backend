import { GamelogModel } from './gamelog.entity';

export function gamelog(doc) {
  new GamelogModel(doc).save();
}
