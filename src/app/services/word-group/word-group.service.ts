import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { WordGroupsApiService } from '../word-groups-api/word-groups-api.service';
import { WordGroupParameterEnum } from '../../enums/word-group.parameter.enum';
import { WordGroupRequest } from '../../interfaces/word-group-request';
import { WordGroupsStore } from '../../store/word-groups.store';
import { WordGroup } from '../../interfaces/word-group';

@Injectable({
  providedIn: 'root',
})
export class WordGroupService {
  private wordsApiService = inject(WordGroupsApiService);
  private wordGroupsStore = inject(WordGroupsStore);

  readonly groups: Signal<WordGroup[]> = this.wordGroupsStore.groups;

  fetchIsLoading: WritableSignal<boolean> = signal(false);
  fetchError: WritableSignal<Error> = signal(null);

  updateIsLoading: WritableSignal<boolean> = signal(false);
  updateError: WritableSignal<Error> = signal(null);

  deleteIsLoading: WritableSignal<boolean> = signal(false);
  deleteError: WritableSignal<Error> = signal(null);

  getGroups(): Observable<WordGroup[]> {
    const updateRequestState = (error: Error, isLoading: boolean): void => {
      this.fetchError.set(error);
      this.fetchIsLoading.set(isLoading);
    }

    updateRequestState(null, true);
    return this.wordsApiService.getGroups().pipe(
      tap(response => {
        this.wordGroupsStore.addGroups(response);
        updateRequestState(null, false)
      }),
      catchError(err => {
        updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  addGroup(word: WordGroupRequest): Observable<WordGroup> {
    this.updateRequestState(null, true);
    return this.wordsApiService.addGroup(word).pipe(
      tap(response => {
        this.wordGroupsStore.addGroup(response);
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  addGroupSet(groups: WordGroupRequest[]): Observable<WordGroup[]> {
    this.updateRequestState(null, true);
    return this.wordsApiService.addGroupSet(groups).pipe(
      tap(response => {
        this.wordGroupsStore.addGroups(response);
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  updateGroup(id: string, group: WordGroupRequest): Observable<void> {
    this.updateRequestState(null, true);
    return this.wordsApiService.updateGroup(id, group).pipe(
      tap(() => {
        this.wordGroupsStore.updateGroup({
          ...group,
          [WordGroupParameterEnum.ID]: id
        });
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  deleteGroup(id: string): Observable<void> {
    const updateRequestState = (error: Error, isLoading: boolean): void => {
      this.deleteError.set(error);
      this.deleteIsLoading.set(isLoading);
    }

    updateRequestState(null, true);
    return this.wordsApiService.deleteGroup(id).pipe(
      tap(() => {
        this.wordGroupsStore.deleteGroup(id);
        updateRequestState(null, false)
      }),
      catchError(err => {
        updateRequestState(err, false);
        return throwError(err);
      })
    );
  }

  resetStore = this.wordGroupsStore.resetStore;

  private updateRequestState(error: Error, isLoading: boolean): void {
    this.updateError.set(error);
    this.updateIsLoading.set(isLoading);
  }
}
