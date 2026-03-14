import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, Message } from '../../services/message.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-thread-container">
      <!-- Message List -->
      <div class="message-list">
        <div *ngIf="messages && messages.length > 0; else noMessages" class="messages">
          <div *ngFor="let message of messages" [class.message-item]="true" [ngClass]="getMessageClass(message)">
            <div class="message-header">
              <div class="sender-info">
                <span class="sender-name">Agent #{{ message.senderAgentId || 'System' }}</span>
                <span class="timestamp">{{ formatDate(message.createdAt) }}</span>
              </div>
              <div class="message-type-badge" [ngClass]="'type-' + message.messageType">
                {{ message.messageType }}
              </div>
            </div>
            <div *ngIf="message.subject" class="message-subject">
              <strong>{{ message.subject }}</strong>
            </div>
            <div class="message-content">
              {{ message.content }}
            </div>
            <div *ngIf="message.metadata" class="message-metadata">
              <details>
                <summary>Details</summary>
                <pre>{{ formatJSON(message.metadata) }}</pre>
              </details>
            </div>
          </div>
        </div>
        <ng-template #noMessages>
          <div class="no-messages">
            <p class="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        </ng-template>
      </div>

      <!-- Send Message Form -->
      <div class="message-form-container">
        <form (ngSubmit)="sendMessage()" class="message-form">
          <div class="form-group">
            <label>
              <span class="text-sm text-gray-600">To:</span>
              <input 
                type="number" 
                [(ngModel)]="newMessage.recipientAgentId" 
                name="recipientAgentId"
                placeholder="Agent ID (optional)"
                class="input-field">
            </label>
          </div>
          <div class="form-group">
            <label>
              <span class="text-sm text-gray-600">Type:</span>
              <select [(ngModel)]="newMessage.messageType" name="messageType" class="input-field">
                <option value="standard">Standard</option>
                <option value="system">System</option>
                <option value="delegation">Delegation</option>
                <option value="approval_request">Approval Request</option>
              </select>
            </label>
          </div>
          <div class="form-group">
            <label>
              <span class="text-sm text-gray-600">Subject (optional):</span>
              <input 
                type="text" 
                [(ngModel)]="newMessage.subject" 
                name="subject"
                placeholder="Message subject"
                class="input-field">
            </label>
          </div>
          <div class="form-group">
            <label>
              <span class="text-sm text-gray-600">Message:</span>
              <textarea 
                [(ngModel)]="newMessage.content" 
                name="content"
                placeholder="Type your message..."
                class="textarea-field"
                rows="3"></textarea>
            </label>
          </div>
          <button 
            type="submit" 
            [disabled]="isSubmitting || !newMessage.content"
            class="submit-button">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .message-thread-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 1rem;
    }

    .message-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      background-color: #f9fafb;
    }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-item {
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .message-item.sent {
      background-color: #e3f2fd;
      margin-left: 2rem;
    }

    .message-item.received {
      background-color: #f5f5f5;
      margin-right: 2rem;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sender-info {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .sender-name {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .timestamp {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .message-type-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .type-standard {
      background-color: #d1d5db;
      color: #374151;
    }

    .type-system {
      background-color: #dcfce7;
      color: #166534;
    }

    .type-delegation {
      background-color: #fef3c7;
      color: #92400e;
    }

    .type-approval_request {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .message-subject {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
    }

    .message-content {
      font-size: 0.875rem;
      line-height: 1.5;
      color: #374151;
      word-wrap: break-word;
    }

    .message-metadata {
      margin-top: 0.5rem;
      font-size: 0.75rem;
    }

    .message-metadata details {
      cursor: pointer;
    }

    .message-metadata pre {
      background-color: #f3f4f6;
      padding: 0.5rem;
      border-radius: 0.25rem;
      overflow-x: auto;
      max-height: 200px;
      font-size: 0.7rem;
    }

    .no-messages {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .message-form-container {
      border-top: 2px solid #e5e7eb;
      padding: 1rem;
      background-color: white;
      border-radius: 0.5rem;
    }

    .message-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .form-group label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .input-field,
    .textarea-field {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-family: inherit;
    }

    .input-field:focus,
    .textarea-field:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .textarea-field {
      resize: vertical;
    }

    .submit-button {
      padding: 0.5rem 1rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .submit-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .error-message {
      padding: 0.75rem;
      background-color: #fee2e2;
      color: #991b1b;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .success-message {
      padding: 0.75rem;
      background-color: #dcfce7;
      color: #166534;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }
  `]
})
export class MessageThreadComponent implements OnInit {
  @Input() runId!: number;

  messages: Message[] = [];
  newMessage: Partial<MessageRequest> = {
    messageType: 'standard',
    content: ''
  };
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    if (this.runId) {
      this.loadMessages();
    }
  }

  loadMessages() {
    this.messageService.getRunMessages(this.runId).subscribe({
      next: (messages: Message[]) => {
        this.messages = messages;
      },
      error: (error: any) => {
        console.error('Failed to load messages:', error);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.content || !this.newMessage.content.trim()) {
      this.errorMessage = 'Message content is required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: MessageRequest = {
      senderAgentId: undefined,
      recipientAgentId: this.newMessage.recipientAgentId as number | undefined,
      messageType: this.newMessage.messageType || 'standard',
      subject: this.newMessage.subject,
      content: this.newMessage.content
    };

    this.messageService.sendMessage(this.runId, request).subscribe({
      next: (message: Message) => {
        this.messages.push(message);
        this.newMessage = {
          messageType: 'standard',
          content: ''
        };
        this.successMessage = 'Message sent!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to send message: ' + (error.error?.message || error.message);
        this.isSubmitting = false;
      }
    });
  }

  getMessageClass(message: Message): string {
    return message.senderAgentId ? 'sent' : 'received';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatJSON(json: string | undefined): string {
    if (!json) return '';
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  }
}

interface MessageRequest {
  runId?: number;
  senderAgentId?: number;
  recipientAgentId?: number;
  messageType?: string;
  subject?: string;
  content: string;
  metadata?: string;
}
