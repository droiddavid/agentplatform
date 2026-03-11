import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentResponse {
  id: number;
  name: string;
  description?: string;
  ownerId?: number;
}

export interface ParseAgentRequest {
  prompt: string;
}

export interface ProposedAgent {
  name: string;
  role: string;
  capabilities: string[];
  toolPermissions: string[];
  approvalSummary: string;
}

export interface ParseAgentResponse {
  proposedAgents: ProposedAgent[];
  requiresReview: boolean;
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

  parseDescription(req: ParseAgentRequest): Observable<ParseAgentResponse> {
    return this.http.post<ParseAgentResponse>(`${this.baseUrl}/api/agents/from-text`, req);
  }
}
