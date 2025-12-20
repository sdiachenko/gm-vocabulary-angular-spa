import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Field, form, required, WithField } from '@angular/forms/signals'
import { v4 as uuidv4 } from 'uuid';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { WordParameterDisplayNameEnum } from '../../../../enum/word-parameter-display-name.enum';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { WordParameterEnum } from '../../../../enum/word.parameter.enum';
import { WordsService } from '../../../../services/words/words.service';
import { WordRequest } from '../../../../interfaces/word-request';
import { WordEditDialogData } from './word-edit-dialog-data';

@Component({
  selector: 'gm-word-edit-dialog',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    ButtonComponent,
    MatDialogActions,
    Field,
    InputComponent,
    DataLoadingWrapper,
    AutocompleteComponent,
  ],
  templateUrl: './word-edit-dialog.component.html',
  styleUrl: './word-edit-dialog.component.scss',
})
export class WordEditDialogComponent {
  private dialogRef = inject(MatDialogRef<WordEditDialogData>);
  data: WordEditDialogData = inject<WordEditDialogData>(MAT_DIALOG_DATA);
  private wordsService = inject(WordsService);

  readonly wordParameterEnum = WordParameterEnum;
  readonly wordParameterDisplayNameEnum = WordParameterDisplayNameEnum;

  wordsUpdateIsLoading: Signal<boolean> = this.wordsService.updateIsLoading;
  wordsUpdateErr: Signal<Error> = this.wordsService.updateError;

  private wordModel: WritableSignal<WordRequest> = signal<WordRequest>({
    [WordParameterEnum.WORD]: this.data?.[WordParameterEnum.WORD] ?? '',
    [WordParameterEnum.TRANSLATION]: this.data?.[WordParameterEnum.TRANSLATION] ?? '',
    [WordParameterEnum.COLLECTION_ID]: this.data?.[WordParameterEnum.COLLECTION_ID] ?? ''
  });

  wordForm = form(this.wordModel,  (schemaPath) => {
    required(schemaPath[WordParameterEnum.WORD], { message: 'Word is required' })
    required(schemaPath[WordParameterEnum.TRANSLATION], { message: 'Translation is required' })
  });

  apply(): void {
    let collectionId = this.wordModel()[WordParameterEnum.COLLECTION_ID];
    let collectionName = collectionId ? this.data.collections.find(collection => collection.id === collectionId)?.name : null;

    if (!collectionName && collectionId != null && collectionId !== '') {
      collectionName = collectionId;
      collectionId = uuidv4();
    }

    const word: WordRequest = {
      ...this.wordModel(),
      collectionName,
      collectionId
    }

    if (this.data?._id != null) {
      this.wordsService.updateWord(this.data._id, word).subscribe({
        next: () => {
          this.close();
        }
      });
      return;
    }

    this.wordsService.addWord(word).subscribe({
      next: () => {
        this.close();
      }
    });
  }

  wordFormValid = computed(() => {
    return [
      this.wordForm[WordParameterEnum.WORD]().errors()?.length === 0,
      this.wordForm[WordParameterEnum.TRANSLATION]().errors().length === 0
    ].every(noError => noError)
  });

  getFormFieldErrors(errors: WithField<any>[]): string[] {
    return errors.map(error => error.message);
  }

  close(): void {
    this.dialogRef.close();
  }
}
