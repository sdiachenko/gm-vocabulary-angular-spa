import { WordParameterEnum } from '../enum/word.parameter.enum';
import { Collection } from './collection';

export interface WordRequest extends Partial<Collection> {
  [WordParameterEnum.WORD]: string;
  [WordParameterEnum.TRANSLATION]: string;
}
