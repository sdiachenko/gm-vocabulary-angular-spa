import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Field, form, required, WithField } from '@angular/forms/signals'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { WordParameterDisplayNameEnum } from '../../../../enum/word-parameter-display-name.enum';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { WordParameterEnum } from '../../../../enum/word.parameter.enum';
import { WordsService } from '../../../../services/words/words.service';
import { WordRequest } from '../../../../interfaces/word-request';
import { Word } from '../../../../interfaces/word';

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
  ],
  templateUrl: './word-edit-dialog.component.html',
  styleUrl: './word-edit-dialog.component.scss',
})
export class WordEditDialogComponent {
  dialogRef = inject(MatDialogRef<Word>);
  data: Word = inject<Word>(MAT_DIALOG_DATA);
  private wordsService = inject(WordsService);

  wordsUpdateIsLoading: Signal<boolean> = this.wordsService.updateIsLoading;
  wordsUpdateErr: Signal<Error> = this.wordsService.updateError;

  readonly wordParameterDisplayNameEnum = WordParameterDisplayNameEnum;

  wordModel: WritableSignal<WordRequest> = signal<WordRequest>({
    [WordParameterEnum.WORD]: this.data?.word ?? '',
    [WordParameterEnum.TRANSLATION]: this.data?.translation ?? '',
  });

  wordForm = form(this.wordModel,  (schemaPath) => {
    required(schemaPath.word, { message: 'Word is required' })
    required(schemaPath.translation, { message: 'Translation is required' })
  });

  apply(): void {
    if (this.data?._id != null) {
      this.wordsService.updateWord(this.data._id, this.wordModel()).subscribe({
        next: () => {
          this.close();
        }
      });
      return;
    }

    this.wordsService.addWord(this.wordModel()).subscribe({
      next: () => {
        this.close();
      }
    });
  }

  wordFormValid = computed(() => {
    return [
      this.wordForm.word().errors()?.length === 0,
      this.wordForm.translation().errors().length === 0
    ].every(noError => noError)
  });

  getFormFieldErrors(errors: WithField<any>[]): string[] {
    return errors.map(error => error.message);
  }

  close(): void {
    this.dialogRef.close();
  }
}
