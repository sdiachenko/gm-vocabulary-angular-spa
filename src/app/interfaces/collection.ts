import { WordParameterEnum } from '../enum/word.parameter.enum';

export interface Collection {
  [WordParameterEnum.COLLECTION_NAME]: string;
  [WordParameterEnum.COLLECTION_ID]: string;
}
