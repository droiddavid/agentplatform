import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  id: number;
  runId: number;
  senderAgentId?: number;
  recipientAgentId?: number;
  messageType: string; // standard, system, delegation, approval_request, etc.
  subject?: string;
  content: string;
  metadata?: string;
  status: string; // sent, read, archived, deleted
  createdAt: string;
  updatedAt: string;
}

export interface MessageRequest {
  runId?: number;
  senderAgentId?: number;
  recipientAgentId?: number;
  messageType?: string;
  subject?: string;
  content: string;
  metadata?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = '/api/runs';

  constructor(private http: HttpClient) { }

  /**
   * Send a new message
   */
  sendMessage(runId: number, request: MessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/${runId}/messages`, request);
  }

  /**
   * Get all messages for a run
   */
  getRunMessages(runId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${runId}/messages`);
  }

  /**
   * Get paginated messages for a run
   */
  getRunMessagesPaginated(runId: number, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/${runId}/messages/paginated`, { params });
  }

  /**
   * Get a specific message
   */
  getMessage(runId: number, messageId: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${runId}/messages/${messageId}`);
  }

  /**
   * Get messages sent by a specific agent
   */
  getMessagesBySender(runId: number, agentId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${runId}/messages/sender/${agentId}`);
  }

  /**
   * Get messages received by a specific agent
   */
  getMessagesForRecipient(runId: number, agentId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${runId}/messages/recipient/${agentId}`);
  }

  /**
   * Get messages of a specific type
   */
  getMessagesByType(runId: number, messageType: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${runId}/messages/type/${messageType}`);
  }

  /**
   * Get unread messages for an agent
   */
  getUnreadMessages(runId: number, agentId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${runId}/messages/unread/${agentId}`);
  }

  /**
   * Mark message as read
   */
  markAsRead(runId: number, messageId: number): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${runId}/messages/${messageId}/read`, {});
  }

  /**
   * Delete a message
   */
  deleteMessage(runId: number, messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${runId}/messages/${messageId}`);
  }

  /**
   * Get message count for a run
   */
  getMessageCount(runId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/messages/stats/count`);
  }

  /**
   * Get unread message count for an agent
   */
  getUnreadMessageCount(runId: number, agentId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${runId}/messages/unread-count/${agentId}`);
  }
}
