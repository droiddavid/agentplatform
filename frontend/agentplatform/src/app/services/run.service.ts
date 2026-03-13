import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Run {
  id: number;
  taskId: number;
  agentId: number;
  ownerId: number;
  status: string;
  input?: string;
  output?: string;
  logs?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RunRequest {
  taskId: number;
  agentId: number;
  input?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RunService {
  private apiUrl = '/api/runs';

  constructor(private http: HttpClient) { }

  /**
   * Start a new run for an agent
   */
  startAgentRun(agentId: number, taskId?: number, description?: string): Observable<Run> {
    const payload = {
      agentId,
      taskId: taskId || null,
      description: description || 'Run started from dashboard'
    };
    return this.http.post<Run>(`/api/agents/${agentId}/runs`, payload);
  }

  /**
   * List runs for a specific agent
   */
  listAgentRuns(agentId: number): Observable<Run[]> {
    return this.http.get<Run[]>(`/api/agents/${agentId}/runs`);
  }

  createRun(request: RunRequest): Observable<Run> {
    return this.http.post<Run>(this.apiUrl, request);
  }

  getRun(id: number): Observable<Run> {
    return this.http.get<Run>(`${this.apiUrl}/${id}`);
  }

  listRuns(page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  listRunsByStatus(status: string, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/status`, { params });
  }

  listRunsByTask(taskId: number, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/task/${taskId}`, { params });
  }

  listRunsByAgent(agentId: number, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/agent/${agentId}`, { params });
  }

  updateRunStatus(id: number, status: string): Observable<Run> {
    let params = new HttpParams().set('status', status);
    return this.http.put<Run>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  startRun(id: number): Observable<Run> {
    return this.http.post<Run>(`${this.apiUrl}/${id}/start`, {});
  }

  completeRun(id: number, output?: string, logs?: string): Observable<Run> {
    let params = new HttpParams();
    if (output) params = params.set('output', output);
    if (logs) params = params.set('logs', logs);
    return this.http.post<Run>(`${this.apiUrl}/${id}/complete`, {}, { params });
  }

  failRun(id: number, errorMessage?: string, logs?: string): Observable<Run> {
    let params = new HttpParams();
    if (errorMessage) params = params.set('errorMessage', errorMessage);
    if (logs) params = params.set('logs', logs);
    return this.http.post<Run>(`${this.apiUrl}/${id}/fail`, {}, { params });
  }

  cancelRun(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {});
  }

  countRunsByStatus(status: string): Observable<number> {
    let params = new HttpParams().set('status', status);
    return this.http.get<number>(`${this.apiUrl}/stats/count`, { params });
  }
}
