import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WordGroupRequest } from '../../interfaces/word-group-request';
import { environment } from '../../../environments/environment';
import { WordGroup } from '../../interfaces/word-group';

@Injectable({
  providedIn: 'root',
})
export class WordGroupsApiService {
  private http = inject(HttpClient);

  private BASE_URL = `${environment.vocabularyApiUrl}/collections`;

  public groups: HttpResourceRef<WordGroup[]> = httpResource<WordGroup[]>(() => this.BASE_URL, {defaultValue: []});

  addGroup(word: WordGroupRequest): Observable<WordGroup> {
    return this.http.post<WordGroup>(this.BASE_URL, word);
  }

  addGroupSet(word: WordGroupRequest[]): Observable<WordGroup[]> {
    return this.http.post<WordGroup[]>(`${this.BASE_URL}/bulk`, word);
  }

  updateGroup(id: string, word: WordGroupRequest): Observable<WordGroup> {
    return this.http.put<WordGroup>(`${this.BASE_URL}/${id}`, word);
  }

  deleteGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
