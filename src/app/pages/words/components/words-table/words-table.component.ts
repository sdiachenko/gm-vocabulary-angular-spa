import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { TableComponent } from "../../../../shared/components/table/table.component";
import { WordsTableColumns } from './words-table-columns.const';
import { WordsTableRow } from './words-table-row';

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

  @Input() dataSource!: WordsTableRow[];

  @Output() addWord = new EventEmitter();
  @Output() editWord = new EventEmitter<WordsTableRow>();
  @Output() deleteWords = new EventEmitter<WordsTableRow[]>();

  readonly wordsTableColumns = WordsTableColumns;
  selectedWords!: WordsTableRow[];
}
