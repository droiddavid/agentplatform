import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentResponse {
  id: number;
  name: string;
  description?: string;
  ownerId?: number;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly baseUrl = 'http://localhost:8083';

  constructor(private http: HttpClient) {}

  getAgents(): Observable<AgentResponse[]> {
    return this.http.get<AgentResponse[]>(`${this.baseUrl}/api/agents`);
  }

  create(req: { name: string; description?: string }) {
    return this.http.post(`${this.baseUrl}/api/agents`, req);
  }

  getAgent(id: number) { return this.http.get<AgentResponse>(`${this.baseUrl}/api/agents/${id}`); }

  updateAgent(id: number, req: { name?: string; description?: string }) { return this.http.put(`${this.baseUrl}/api/agents/${id}`, req); }
}
