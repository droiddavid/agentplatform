import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskBoardItem {
  id: string;
  runId: string;
  createdByRunAgentId?: string;
  assignedToRunAgentId?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskBoardItemRequest {
  runId: string;
  createdByRunAgentId?: string;
  assignedToRunAgentId?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
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
export class TaskBoardItemService {
  private apiUrl = '/api/runs';

  constructor(private http: HttpClient) { }

  sendTaskBoardItem(runId: number, request: TaskBoardItemRequest): Observable<TaskBoardItem> {
    return this.http.post<TaskBoardItem>(`${this.apiUrl}/${runId}/board-items`, request);
  }

  getRunTaskBoardItems(runId: number): Observable<TaskBoardItem[]> {
    return this.http.get<TaskBoardItem[]>(`${this.apiUrl}/${runId}/board-items`);
  }

  getRunTaskBoardItemsPaginated(runId: number, page: number, size: number): Observable<Page<TaskBoardItem>> {
    return this.http.get<Page<TaskBoardItem>>(`${this.apiUrl}/${runId}/board-items/paginated`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getTaskBoardItem(runId: number, itemId: string): Observable<TaskBoardItem> {
    return this.http.get<TaskBoardItem>(`${this.apiUrl}/${runId}/board-items/${itemId}`);
  }

  getTaskBoardItemsByStatus(runId: number, status: string): Observable<TaskBoardItem[]> {
    return this.http.get<TaskBoardItem[]>(`${this.apiUrl}/${runId}/board-items/status/${status}`);
  }

  getTaskBoardItemsByPriority(runId: number, priority: string): Observable<TaskBoardItem[]> {
    return this.http.get<TaskBoardItem[]>(`${this.apiUrl}/${runId}/board-items/priority/${priority}`);
  }

  getTaskBoardItemsAssignedTo(runId: number, agentId: string): Observable<TaskBoardItem[]> {
    return this.http.get<TaskBoardItem[]>(`${this.apiUrl}/${runId}/board-items/assigned-to/${agentId}`);
  }

  updateTaskBoardItem(runId: number, itemId: string, request: TaskBoardItemRequest): Observable<TaskBoardItem> {
    return this.http.put<TaskBoardItem>(`${this.apiUrl}/${runId}/board-items/${itemId}`, request);
  }

  markAsCompleted(runId: number, itemId: string): Observable<TaskBoardItem> {
    return this.http.put<TaskBoardItem>(`${this.apiUrl}/${runId}/board-items/${itemId}/complete`, {});
  }

  deleteTaskBoardItem(runId: number, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${runId}/board-items/${itemId}`);
  }

  getTaskBoardItemCount(runId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/board-items/stats/count`);
  }

  getTaskBoardItemCountByStatus(runId: number, status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/board-items/stats/count-by-status/${status}`);
  }
}
