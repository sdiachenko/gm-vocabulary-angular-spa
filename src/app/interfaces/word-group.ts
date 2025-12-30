import { WordGroupParameterEnum } from '../enums/word-group.parameter.enum';
import { WordGroupRequest } from './word-group-request';
import { Word } from './word';

export interface WordGroup extends WordGroupRequest {
  [WordGroupParameterEnum.ID]: string;
  [WordGroupParameterEnum.WORDS]?: Word[];
}
