import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TemplateResponse {
  id: number;
  name: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly baseUrl = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  list(): Observable<TemplateResponse[]> {
    return this.http.get<TemplateResponse[]>(`${this.baseUrl}/api/templates`);
  }

  get(id: number) { return this.http.get<TemplateResponse>(`${this.baseUrl}/api/templates/${id}`); }
}
