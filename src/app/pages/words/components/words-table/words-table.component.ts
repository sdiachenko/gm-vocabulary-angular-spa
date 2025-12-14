import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { TableComponent } from "../../../../shared/components/table/table.component";
import { WordsTableColumns } from '../../const/words-table-columns.const';
import { Word } from '../../../../interfaces/word';

@Component({
  selector: 'gm-words-table',
  imports: [
    ButtonComponent,
    TableComponent
  ],
  templateUrl: './words-table.component.html',
  styleUrl: './words-table.component.scss',
})
export class WordsTableComponent {

  @Input() dataSource!: Word[];

  @Output() addWord = new EventEmitter();
  @Output() editWord = new EventEmitter<Word>();
  @Output() deleteWords = new EventEmitter<Word[]>();

  readonly wordsTableColumns = WordsTableColumns;
  selectedWords!: Word[];
}
