import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgentCapabilityResponse {
  id: number;
  capabilityName: string;
  description?: string;
  enabled: boolean;
  createdAt?: string;
}

export interface AgentToolPermissionResponse {
  id: number;
  toolName: string;
  permissionLevel: string;
  requiresApproval: boolean;
  createdAt?: string;
}

export interface AgentPolicyResponse {
  id: number;
  policyName: string;
  policyValue: string;
  createdAt?: string;
}

export interface AgentResponse {
  id: number;
  ownerId?: number;
  templateId?: number;
  name: string;
  description?: string;
  status?: string;
  visibility?: string;
  modelPreference?: string;
  instructions?: string;
  systemPrompt?: string;
  capabilities?: AgentCapabilityResponse[];
  toolPermissions?: AgentToolPermissionResponse[];
  policies?: AgentPolicyResponse[];
  createdAt?: string;
  updatedAt?: string;
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

  // Agent CRUD
  getAgents(): Observable<AgentResponse[]> {
    return this.http.get<AgentResponse[]>(`${this.baseUrl}/api/agents`);
  }

  create(req: any): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(`${this.baseUrl}/api/agents`, req);
  }

  getAgent(id: number): Observable<AgentResponse> {
    return this.http.get<AgentResponse>(`${this.baseUrl}/api/agents/${id}`);
  }

  updateAgent(id: number, req: { name?: string; description?: string; templateId?: number; modelPreference?: string; instructions?: string; systemPrompt?: string }): Observable<AgentResponse> {
    return this.http.put<AgentResponse>(`${this.baseUrl}/api/agents/${id}`, req);
  }

  deleteAgent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/agents/${id}`);
  }

  // Capability management
  getCapabilities(agentId: number): Observable<AgentCapabilityResponse[]> {
    return this.http.get<AgentCapabilityResponse[]>(`${this.baseUrl}/api/agents/${agentId}/capabilities`);
  }

  addCapability(agentId: number, capabilityName: string, description?: string): Observable<AgentCapabilityResponse> {
    return this.http.post<AgentCapabilityResponse>(`${this.baseUrl}/api/agents/${agentId}/capabilities`,
      { capabilityName, description });
  }

  removeCapability(agentId: number, capabilityId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/agents/${agentId}/capabilities/${capabilityId}`);
  }

  // Tool permission management
  getToolPermissions(agentId: number): Observable<AgentToolPermissionResponse[]> {
    return this.http.get<AgentToolPermissionResponse[]>(`${this.baseUrl}/api/agents/${agentId}/tool-permissions`);
  }

  addToolPermission(agentId: number, toolName: string, permissionLevel?: string, requiresApproval?: boolean): Observable<AgentToolPermissionResponse> {
    return this.http.post<AgentToolPermissionResponse>(`${this.baseUrl}/api/agents/${agentId}/tool-permissions`,
      { toolName, permissionLevel: permissionLevel || 'execute', requiresApproval: requiresApproval || false });
  }

  // Policy management
  getPolicies(agentId: number): Observable<AgentPolicyResponse[]> {
    return this.http.get<AgentPolicyResponse[]>(`${this.baseUrl}/api/agents/${agentId}/policies`);
  }

  addPolicy(agentId: number, policyName: string, policyValue: string): Observable<AgentPolicyResponse> {
    return this.http.post<AgentPolicyResponse>(`${this.baseUrl}/api/agents/${agentId}/policies`,
      { policyName, policyValue });
  }

  // Parser
  parseDescription(req: ParseAgentRequest): Observable<ParseAgentResponse> {
    return this.http.post<ParseAgentResponse>(`${this.baseUrl}/api/agents/parse`, req);
  }
}
