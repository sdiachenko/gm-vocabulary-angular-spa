import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { WordRequest } from '../../interfaces/word-request';
import { Word } from '../../interfaces/word';

@Injectable({
  providedIn: 'root',
})
export class WordsApiService {

  private http = inject(HttpClient);

  private BASE_URL = `${environment.vocabularyApiUrl}/words`;

  public words: HttpResourceRef<Word[]> = httpResource<Word[]>(() => this.BASE_URL, {defaultValue: []});

  addWord(word: WordRequest): Observable<Word> {
    return this.http.post<Word>(this.BASE_URL, word);
  }

  updateWord(id: string, word: WordRequest): Observable<Word> {
    return this.http.put<Word>(`${this.BASE_URL}/${id}`, word);
  }

  deleteWords(ids: string[]): Observable<void> {
    return this.http.delete<void>(this.BASE_URL, {
      body: { ids }
    });
  }
}
