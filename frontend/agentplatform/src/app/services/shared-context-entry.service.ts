import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SharedContextEntry {
  id: string;
  runId: string;
  createdByRunAgentId?: string;
  contextKey: string;
  contextValueJson: string;
  visibilityScope: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedContextEntryRequest {
  runId: string;
  createdByRunAgentId?: string;
  contextKey: string;
  contextValueJson: string;
  visibilityScope?: string;
}

export interface Page<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SharedContextEntryService {
  private apiUrl = '/api/runs';

  constructor(private http: HttpClient) { }

  createContextEntry(runId: number, request: SharedContextEntryRequest): Observable<SharedContextEntry> {
    return this.http.post<SharedContextEntry>(`${this.apiUrl}/${runId}/context-entries`, request);
  }

  getRunContextEntries(runId: number): Observable<SharedContextEntry[]> {
    return this.http.get<SharedContextEntry[]>(`${this.apiUrl}/${runId}/context-entries`);
  }

  getRunContextEntriesPaginated(runId: number, page: number, size: number): Observable<Page<SharedContextEntry>> {
    return this.http.get<Page<SharedContextEntry>>(`${this.apiUrl}/${runId}/context-entries/paginated`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getContextEntry(runId: number, entryId: string): Observable<SharedContextEntry> {
    return this.http.get<SharedContextEntry>(`${this.apiUrl}/${runId}/context-entries/${entryId}`);
  }

  getContextEntriesByKey(runId: number, contextKey: string): Observable<SharedContextEntry[]> {
    return this.http.get<SharedContextEntry[]>(`${this.apiUrl}/${runId}/context-entries/key/${contextKey}`);
  }

  getLatestContextEntryByKey(runId: number, contextKey: string): Observable<SharedContextEntry> {
    return this.http.get<SharedContextEntry>(`${this.apiUrl}/${runId}/context-entries/key/${contextKey}/latest`);
  }

  getContextEntriesByVisibilityScope(runId: number, visibilityScope: string): Observable<SharedContextEntry[]> {
    return this.http.get<SharedContextEntry[]>(`${this.apiUrl}/${runId}/context-entries/visibility/${visibilityScope}`);
  }

  updateContextEntry(runId: number, entryId: string, request: SharedContextEntryRequest): Observable<SharedContextEntry> {
    return this.http.put<SharedContextEntry>(`${this.apiUrl}/${runId}/context-entries/${entryId}`, request);
  }

  deleteContextEntry(runId: number, entryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${runId}/context-entries/${entryId}`);
  }

  getContextEntryCount(runId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/context-entries/stats/count`);
  }

  getContextEntryCountByVisibilityScope(runId: number, visibilityScope: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/context-entries/stats/count-by-visibility/${visibilityScope}`);
  }
}
