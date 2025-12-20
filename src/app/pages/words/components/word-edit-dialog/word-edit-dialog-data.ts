import { SelectOption } from '../../../../shared/interfaces/select-option';
import { Word } from '../../../../interfaces/word';

export interface WordEditDialogData extends Word {
  collections: SelectOption[];
}
