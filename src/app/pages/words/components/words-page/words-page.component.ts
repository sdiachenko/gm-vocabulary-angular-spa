import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, Signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { SubmitDialogComponent } from '../../../../shared/components/submit-dialog/submit-dialog.component';
import { SubmitDialogData } from '../../../../shared/components/submit-dialog/submit-dialog-data';
import { WordEditDialogComponent } from '../word-edit-dialog/word-edit-dialog.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { WordGroupService } from '../../../../services/word-group/word-group.service';
import { WordGroupParameterEnum } from '../../../../enums/word-group.parameter.enum';
import { WordEditDialogData } from '../word-edit-dialog/word-edit-dialog-data';
import { WordsTableComponent } from '../words-table/words-table.component';
import { SelectOption } from '../../../../shared/interfaces/select-option';
import { WordParameterEnum } from '../../../../enums/word.parameter.enum';
import { WordsService } from '../../../../services/words/words.service';
import { WordsTableRow } from '../words-table/words-table-row';
import { Word } from '../../../../interfaces/word';

@Component({
  selector: 'gm-words-page',
  imports: [
    WordsTableComponent,
    ButtonComponent,
    DataLoadingWrapper,
  ],
  templateUrl: './words-page.component.html',
  styleUrl: './words-page.component.scss',
})
export class WordsPageComponent implements OnInit, OnDestroy {
  private readonly wordsService = inject(WordsService);
  private readonly wordGroupService = inject(WordGroupService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly words: Signal<WordsTableRow[]> = computed(() => {
    return this.wordsService.words().map(word => {
      return {
        ...word,
        [WordParameterEnum.GROUP_NAMES]: word[WordParameterEnum.GROUP_IDS]?.map(groupId => {
          return this.wordGroupService.groups()
            .find(group => group[WordGroupParameterEnum.ID] === groupId)?.[WordGroupParameterEnum.NAME];
        }),
      }
    });
  });

  readonly wordGroups: Signal<SelectOption[]> = computed(() => {
    return this.wordGroupService.groups().map((group) => {
      return {
        id: group[WordGroupParameterEnum.ID],
        name: group[WordGroupParameterEnum.NAME]
      }
    })
  });

  readonly fetchIsLoading: Signal<boolean> = this.wordsService.fetchIsLoading;
  readonly fetchError: Signal<Error> = this.wordsService.fetchError;
  readonly deleteIsLoading: Signal<boolean> = this.wordsService.deleteIsLoading;
  readonly deleteError: Signal<Error> = this.wordsService.deleteError;

  private wordEditDialogRef!: MatDialogRef<any>;
  private wordsDeleteDialogRef!: MatDialogRef<any>;

  ngOnInit(): void {
    forkJoin([
      this.wordsService.getWords(),
      this.wordGroupService.getGroups()
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openEditDialog(word?: Word) {
    this.wordEditDialogRef = this.dialog.open<WordEditDialogComponent, WordEditDialogData | {}>(WordEditDialogComponent, {
      data: {
        ...(word ?? {}),
        wordGroups: this.wordGroups() ?? []
      }
    });
  }

  deleteWords(words: Word[]) {
    this.wordsDeleteDialogRef = this.dialog.open<SubmitDialogComponent, SubmitDialogData>(SubmitDialogComponent, {
      data: {
        title: 'Delete',
        text: 'Are you sure you want to delete selected words?'
      }
    });

    this.wordsDeleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.wordsService.deleteWords(words.map(word => word[WordParameterEnum.ID])).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.wordEditDialogRef?.close();
    this.wordsDeleteDialogRef?.close();
    this.wordsService.resetStore();
    this.wordGroupService.resetStore();
  }
}
