import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private api = '/api/executions';

  constructor(private http: HttpClient) {}

  /**
   * Get agents assigned to a task
   */
  getTaskAgents(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/task/${taskId}/agents`);
  }

  /**
   * Execute a task with its primary agent
   */
  executeTask(taskId: number): Observable<any> {
    return this.http.post(`${this.api}/task/${taskId}/execute`, {});
  }

  /**
   * Execute a task with a specific agent
   */
  executeTaskWithAgent(taskId: number, agentId: number | string): Observable<any> {
    return this.http.post(`${this.api}/task/${taskId}/agent/${agentId}`, {});
  }

  /**
   * Get execution history (runs) for a task
   */
  getTaskExecutionHistory(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/task/${taskId}/history`);
  }

  /**
   * Mark a run as complete with output
   */
  completeRun(runId: number, output: string): Observable<any> {
    return this.http.patch(`${this.api}/${runId}/complete`, { output });
  }

  /**
   * Mark a run as failed with error
   */
  failRun(runId: number, errorMessage: string): Observable<any> {
    return this.http.patch(`${this.api}/${runId}/fail`, { error_message: errorMessage });
  }
}
