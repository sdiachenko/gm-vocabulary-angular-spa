import { WordParameterEnum } from '../enum/word.parameter.enum';

export interface WordRequest {
  [WordParameterEnum.WORD]: string;
  [WordParameterEnum.TRANSLATION]: string;
}
