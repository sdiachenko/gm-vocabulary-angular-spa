import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpResourceRef } from '@angular/common/http';

import { SelectOption } from '../../shared/interfaces/select-option';
import { WordParameterEnum } from '../../enum/word.parameter.enum';
import { WordsApiService } from '../words-api/words-api.service';
import { WordRequest } from '../../interfaces/word-request';
import { Word } from '../../interfaces/word';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private wordsApiService = inject(WordsApiService);

  wordsRes: HttpResourceRef<Word[]> = this.wordsApiService.words;
  isLoading: Signal<boolean> = this.wordsRes.isLoading;
  error: Signal<Error> = this.wordsRes.error;

  updateIsLoading: WritableSignal<boolean> = signal(false);
  updateError: WritableSignal<Error> = signal(null);

  words: Signal<Word[]> = computed(() => {
    return this.wordsRes.value();
  });

  collections: Signal<SelectOption[]> = computed(() => {
    return this.words()?.reduce((acc: SelectOption[], item: Word) => {
      const collectionId = item[WordParameterEnum.COLLECTION_ID];
      if (
        collectionId != null
        && acc.findIndex((accItem: SelectOption) => accItem.id === collectionId) === -1
      ) {
        acc.push({
          id: collectionId,
          name: item[WordParameterEnum.COLLECTION_NAME]
        });
      }
      return acc;
    }, []);
  });

  addWord(word: WordRequest): Observable<Word> {
    this.updateRequestState(null, true);
    return this.wordsApiService.addWord(word).pipe(
      tap(result => {
        this.wordsRes.update(current => [...current, result]);
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  updateWord(id: string, word: WordRequest): Observable<Word> {
    this.updateRequestState(null, true);
    return this.wordsApiService.updateWord(id, word).pipe(
      tap(() => {
        this.wordsRes.update((wordList: Word[]) => {
          return wordList.map((wordListItem: Word) => {
            if (wordListItem._id === id) {
              return {...wordListItem, ...word};
            }
            return wordListItem;
          });
        });
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  deleteWords(ids: string[]): Observable<void> {
    this.updateRequestState(null, true);
    return this.wordsApiService.deleteWords(ids).pipe(
      tap(() => {
        this.wordsRes.update((wordList: Word[]) => {
          return wordList.filter((wordListItem: Word) => !ids.includes(wordListItem._id));
        });
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false);
        return throwError(err);
      })
    );
  }

  private updateRequestState(error: Error, isLoading: boolean): void {
    this.updateError.set(error);
    this.updateIsLoading.set(isLoading);
  }
}
