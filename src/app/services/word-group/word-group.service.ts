import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpResourceRef } from '@angular/common/http';

import { WordGroupsApiService } from '../word-groups-api/word-groups-api.service';
import { WordGroupRequest } from '../../interfaces/word-group-request';
import { WordGroup } from '../../interfaces/word-group';

@Injectable({
  providedIn: 'root',
})
export class WordGroupService {
  private wordsApiService = inject(WordGroupsApiService);

  private readonly groupsRes: HttpResourceRef<WordGroup[]> = this.wordsApiService.groups;
  readonly groups: Signal<WordGroup[]> = this.groupsRes.value;

  readonly fetchIsLoading: Signal<boolean> = this.groupsRes.isLoading;
  readonly fetchError: Signal<Error> = this.groupsRes.error;

  updateIsLoading: WritableSignal<boolean> = signal(false);
  updateError: WritableSignal<Error> = signal(null);

  deleteIsLoading: WritableSignal<boolean> = signal(false);
  deleteError: WritableSignal<Error> = signal(null);

  addGroup(word: WordGroupRequest): Observable<WordGroup> {
    this.updateRequestState(null, true);
    return this.wordsApiService.addGroup(word).pipe(
      tap(result => {
        this.groupsRes.update(current => [...current, result]);
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
      tap(result => {
        this.groupsRes.update(current => [...current, ...result]);
        this.updateRequestState(null, false)
      }),
      catchError(err => {
        this.updateRequestState(err, false)
        return throwError(err);
      })
    );
  }

  updateGroup(id: string, group: WordGroupRequest): Observable<WordGroup> {
    this.updateRequestState(null, true);
    return this.wordsApiService.updateGroup(id, group).pipe(
      tap(() => {
        this.groupsRes.update((wordGroupList: WordGroup[]) => {
          return wordGroupList.map((wordGroupListItem: WordGroup) => {
            if (wordGroupListItem._id === id) {
              return {...wordGroupListItem, ...group};
            }
            return wordGroupListItem;
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

  deleteGroup(id: string): Observable<void> {
    const updateRequestState = (error: Error, isLoading: boolean): void => {
      this.deleteError.set(error);
      this.deleteIsLoading.set(isLoading);
    }

    updateRequestState(null, true);
    return this.wordsApiService.deleteGroup(id).pipe(
      tap(() => {
        this.groupsRes.update((wordGroupList: WordGroup[]) => {
          return wordGroupList.filter((wordGroupListItem: WordGroup) => wordGroupListItem._id !== id);
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
