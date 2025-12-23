import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpResourceRef } from '@angular/common/http';

import { WordsApiService } from '../words-api/words-api.service';
import { WordRequest } from '../../interfaces/word-request';
import { Word } from '../../interfaces/word';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private wordsApiService = inject(WordsApiService);

  private readonly wordsRes: HttpResourceRef<Word[]> = this.wordsApiService.words;
  words: Signal<Word[]> = this.wordsRes.value;

  readonly fetchIsLoading: Signal<boolean> = this.wordsRes.isLoading;
  readonly fetchError: Signal<Error> = this.wordsRes.error;

  updateIsLoading: WritableSignal<boolean> = signal(false);
  updateError: WritableSignal<Error> = signal(null);

  deleteIsLoading: WritableSignal<boolean> = signal(false);
  deleteError: WritableSignal<Error> = signal(null);

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
    const updateRequestState = (error: Error, isLoading: boolean): void => {
      this.deleteError.set(error);
      this.deleteIsLoading.set(isLoading);
    }

    updateRequestState(null, true);
    return this.wordsApiService.deleteWords(ids).pipe(
      tap(() => {
        this.wordsRes.update((wordList: Word[]) => {
          return wordList.filter((wordListItem: Word) => !ids.includes(wordListItem._id));
        });
        updateRequestState(null, false)
      }),
      catchError(err => {
        updateRequestState(err, false);
        return throwError(err);
      })
    );
  }

  private updateRequestState(error: Error, isLoading: boolean): void {
    this.updateError.set(error);
    this.updateIsLoading.set(isLoading);
  }
}
