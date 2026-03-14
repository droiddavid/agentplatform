import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TemplateCategoryResponse {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  createdAt?: string;
}

export interface TemplateResponse {
  id: number;
  name: string;
  description?: string;
  content?: string;
  category?: TemplateCategoryResponse;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly baseUrl = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  list(): Observable<TemplateResponse[]> {
    return this.http.get<TemplateResponse[]>(`${this.baseUrl}/api/templates`);
  }

  get(id: number): Observable<TemplateResponse> {
    return this.http.get<TemplateResponse>(`${this.baseUrl}/api/templates/${id}`);
  }

  listByCategory(categoryId: number): Observable<TemplateResponse[]> {
    return this.http.get<TemplateResponse[]>(`${this.baseUrl}/api/templates/category/${categoryId}`);
  }

  listCategories(): Observable<TemplateCategoryResponse[]> {
    return this.http.get<TemplateCategoryResponse[]>(`${this.baseUrl}/api/templates/categories/all`);
  }

  getCategory(id: number): Observable<TemplateCategoryResponse> {
    return this.http.get<TemplateCategoryResponse>(`${this.baseUrl}/api/templates/categories/${id}`);
  }
}
