import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Field, FieldTree, form, required } from '@angular/forms/signals'
import { defer, iif, of, switchMap } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

import { DataLoadingWrapper } from '../../../../shared/components/data-loading-wrapper/data-loading-wrapper';
import { ChipGridComponent } from '../../../../shared/components/chip-grid.component/chip-grid.component';
import { WordParameterDisplayNameEnum } from '../../../../enums/word-parameter-display-name.enum';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { WordGroupService } from '../../../../services/word-group/word-group.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { WordGroupParameterEnum } from '../../../../enums/word-group.parameter.enum';
import { WordGroupRequest } from '../../../../interfaces/word-group-request';
import { WordParameterEnum } from '../../../../enums/word.parameter.enum';
import { WordsService } from '../../../../services/words/words.service';
import { WordGroup } from '../../../../interfaces/word-group';
import { WordEditDialogData } from './word-edit-dialog-data';
import {
  FormFieldValidationService
} from '../../../../shared/services/form-field-validation/form-field-validation.service';
import { WordForm } from './word-form';

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
    ChipGridComponent,
  ],
  templateUrl: './word-edit-dialog.component.html',
  styleUrl: './word-edit-dialog.component.scss',
})
export class WordEditDialogComponent {
  private dialogRef = inject(MatDialogRef<WordEditDialogData>);
  data: WordEditDialogData = inject<WordEditDialogData>(MAT_DIALOG_DATA);

  private readonly wordsService = inject(WordsService);
  private readonly wordGroupService = inject(WordGroupService);
  private readonly formFieldValidationService = inject(FormFieldValidationService);
  private readonly wordGroups: Signal<WordGroup[]> = this.wordGroupService.groups;

  readonly wordParameterEnum = WordParameterEnum;
  readonly wordParameterDisplayNameEnum = WordParameterDisplayNameEnum;

  wordsUpdateIsLoading: Signal<boolean> = this.wordsService.updateIsLoading;
  wordsUpdateErr: Signal<Error> = this.wordsService.updateError;

  private wordModel: WritableSignal<WordForm> = signal<WordForm>({
    [WordParameterEnum.WORD]: this.data?.[WordParameterEnum.WORD] ?? '',
    [WordParameterEnum.TRANSLATION]: this.data?.[WordParameterEnum.TRANSLATION] ?? '',
    [WordParameterEnum.GROUP_IDS]: this.data?.[WordParameterEnum.GROUP_IDS]?.join(', ') ?? ''
  });

  wordForm: FieldTree<WordForm> = form(this.wordModel,  (schemaPath) => {
    required(schemaPath[WordParameterEnum.WORD], { message: 'Word is required' })
    required(schemaPath[WordParameterEnum.TRANSLATION], { message: 'Translation is required' })
  });

  isWordFormValid = this.formFieldValidationService.isSignalFormValid<WordForm>(this.wordForm);
  getFormFieldErrors = this.formFieldValidationService.getSignalFormFieldErrorMessages;

  apply(): void {
    const selectedGroupsString = this.wordModel()[WordParameterEnum.GROUP_IDS];
    const groupIds = selectedGroupsString != null && selectedGroupsString !== ''
      ? selectedGroupsString.split(', ')
      : null;

    let newGroups: WordGroupRequest[];
    if (groupIds?.length > 0) {
      const existedGroupIds = this.wordGroups().map(({_id}) => _id);
      newGroups = groupIds
        .filter(id => !existedGroupIds.includes(id))
        .map(groupName => ({
          [WordGroupParameterEnum.NAME]: groupName
        }));
    }

    iif(
      () => newGroups?.length > 0,
      defer(() => this.wordGroupService.addGroupSet(newGroups)),
      of(null)
    ).pipe(
      switchMap(newGroupsRes => {
        let updatedGroups: string[];
        if (newGroupsRes?.length > 0) {
          updatedGroups = groupIds.map(id => {
            const newGroupId = newGroupsRes.find(newGroupRes => newGroupRes[WordGroupParameterEnum.NAME] === id)?.[WordGroupParameterEnum.ID];
            if (newGroupId) {
              return newGroupId;
            }
            return id;
          });
        }

        if (this.data?._id == null) {
          return this.wordsService.addWord({
            ...this.wordModel(),
            [WordParameterEnum.GROUP_IDS]: updatedGroups || groupIds
          });
        }

        return this.wordsService.updateWord(
          this.data._id,
          {
            ...this.wordModel(),
            [WordParameterEnum.GROUP_IDS]: updatedGroups || groupIds
          }
        );
      })
    ).subscribe({
      next: () => {
        this.close();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
