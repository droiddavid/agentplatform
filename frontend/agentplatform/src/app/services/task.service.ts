import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  ownerId: number;
  title: string;
  description?: string;
  category: string;
  status: string;
  priority: string;
  dueAt?: string;
  currentRunId?: number;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface TaskRequest {
  title: string;
  description?: string;
  category: string;
  status?: string;
  priority?: string;
  dueAt?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  createTask(request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, request);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  listTasks(page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }

  listTasksByStatus(status: string, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/status`, { params });
  }

  listTasksByPriority(priority: string, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('priority', priority)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/priority`, { params });
  }

  listTasksByCategory(category: string, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/filter/category`, { params });
  }

  updateTask(id: number, request: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, request);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  archiveTask(id: number): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${id}/archive`, {});
  }

  countTasksByStatus(status: string): Observable<number> {
    let params = new HttpParams().set('status', status);
    return this.http.get<number>(`${this.apiUrl}/stats/count`, { params });
  }

  assignRunToTask(taskId: number, runId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${taskId}/assign-run/${runId}`, {});
  }

  clearRunFromTask(taskId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${taskId}/clear-run`, {});
  }

  // Agent assignment methods
  assignAgentToTask(agentId: number, taskId: number): Observable<any> {
    return this.http.post<any>('/api/tasks/agent-assignments', { agentId, taskId });
  }

  unassignAgentFromTask(agentId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/agent-assignments/${agentId}/${taskId}`);
  }

  getAgentsForTask(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/tasks/agent-assignments/task/${taskId}/agents`);
  }

  getAgentIdsForTask(taskId: number): Observable<number[]> {
    return this.http.get<number[]>(`/api/tasks/agent-assignments/task/${taskId}/agent-ids`);
  }

  getTasksForAgent(agentId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/tasks/agent-assignments/agent/${agentId}/tasks`);
  }

  getTaskIdsForAgent(agentId: number): Observable<number[]> {
    return this.http.get<number[]>(`/api/tasks/agent-assignments/agent/${agentId}/task-ids`);
  }

  isAgentAssignedToTask(agentId: number, taskId: number): Observable<boolean> {
    return this.http.get<boolean>(`/api/tasks/agent-assignments/${agentId}/${taskId}/exists`);
  }
}
