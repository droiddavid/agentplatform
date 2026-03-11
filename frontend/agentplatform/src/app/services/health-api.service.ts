import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HealthDto {
     status: string;
     ts: string;
}

@Injectable({ providedIn: 'root' })
export class HealthApiService {
     private readonly baseUrl = 'http://localhost:8081';

     constructor(private http: HttpClient) {}

     getHealth(): Observable<HealthDto> {
          return this.http.get<HealthDto>(`${this.baseUrl}/api/health`);
     }
}