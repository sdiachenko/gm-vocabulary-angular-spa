import { WordGroupParameterEnum } from '../enums/word-group.parameter.enum';
import { WordGroupRequest } from './word-group-request';

export interface WordGroup extends WordGroupRequest {
  [WordGroupParameterEnum.ID]: string;
}
