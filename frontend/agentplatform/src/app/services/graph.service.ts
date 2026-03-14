import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GraphView, GraphNode, GraphEdge, NodeDetails, EdgeDetails, AgentConnections } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private apiUrl = '/api/runs';

  constructor(private http: HttpClient) {}

  /**
   * Get complete graph view for a run
   */
  getGraphView(runId: string): Observable<GraphView> {
    return this.http.get<GraphView>(`${this.apiUrl}/${runId}/graph`);
  }

  /**
   * Get only nodes from the graph
   */
  getGraphNodes(runId: string): Observable<{ nodeCount: number; nodes: GraphNode[] }> {
    return this.http.get<{ nodeCount: number; nodes: GraphNode[] }>(`${this.apiUrl}/${runId}/graph/nodes`);
  }

  /**
   * Get edges from the graph, optionally filtered by type
   */
  getGraphEdges(runId: string, type?: string): Observable<{ edgeCount: number; edges: GraphEdge[] }> {
    let params = new HttpParams();
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<{ edgeCount: number; edges: GraphEdge[] }>(
      `${this.apiUrl}/${runId}/graph/edges`,
      { params }
    );
  }

  /**
   * Get graph statistics
   */
  getGraphStats(runId: string): Observable<{ statistics: Record<string, any> }> {
    return this.http.get<{ statistics: Record<string, any> }>(
      `${this.apiUrl}/${runId}/graph/stats`
    );
  }

  /**
   * Get subgraph for a specific agent
   */
  getAgentSubgraph(runId: string, agentId: string): Observable<GraphView> {
    return this.http.get<GraphView>(
      `${this.apiUrl}/${runId}/graph/subgraph/${agentId}`
    );
  }

  /**
   * Get details for a specific node
   */
  getNodeDetails(runId: string, nodeId: string): Observable<NodeDetails> {
    return this.http.get<NodeDetails>(
      `${this.apiUrl}/${runId}/graph/node/${nodeId}`
    );
  }

  /**
   * Get details for a specific edge
   */
  getEdgeDetails(runId: string, edgeId: string): Observable<EdgeDetails> {
    return this.http.get<EdgeDetails>(
      `${this.apiUrl}/${runId}/graph/edge/${edgeId}`
    );
  }

  /**
   * Get connected agents for a specific agent
   */
  getAgentConnections(runId: string, agentId: string): Observable<AgentConnections> {
    return this.http.get<AgentConnections>(
      `${this.apiUrl}/${runId}/graph/agent/${agentId}/connections`
    );
  }

  /**
   * Check if graph is available for a run
   */
  checkGraphAvailability(runId: string): Observable<any> {
    return this.http.head(`${this.apiUrl}/${runId}/graph`);
  }
}
