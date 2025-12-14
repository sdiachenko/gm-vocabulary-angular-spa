import { TableColumn } from '../../../shared/components/table/table-column';
import { WordParameterEnum } from '../../../enum/word.parameter.enum';
import { WordParameterDisplayNameEnum } from '../../../enum/word-parameter-display-name.enum';

export const WordsTableColumns: TableColumn[] = [
  {
    name: WordParameterEnum.WORD,
    displayName: WordParameterDisplayNameEnum.WORD
  },
  {
    name: WordParameterEnum.TRANSLATION,
    displayName: WordParameterDisplayNameEnum.TRANSLATION
  }
];
