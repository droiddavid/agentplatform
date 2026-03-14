export interface GraphNode {
  id: string;
  agentId?: string;
  agentName?: string;
  type: 'agent' | 'task' | 'execution_event' | string;
  status?: string;
  order?: number;
  createdAt?: Date;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'message' | 'delegation' | 'spawn' | 'collaboration' | string;
  messageType?: string;
  label?: string;
  createdAt?: Date;
  metadata?: Record<string, any>;
}

export interface GraphView {
  id: string;
  runId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  statistics?: Record<string, any>;
  createdAt?: Date;
  metadata?: Record<string, any>;
}

export interface NodeDetails {
  node: GraphNode;
  connectedEdges: GraphEdge[];
  connectedNodes: GraphNode[];
  outgoingConnections: number;
  incomingConnections: number;
}

export interface EdgeDetails {
  edge: GraphEdge;
  fromNode: GraphNode | null;
  toNode: GraphNode | null;
}

export interface AgentConnections {
  agentId: string;
  connectionCount: number;
  connections: string[];
}

export interface GraphNodeStyle {
  x?: number;
  y?: number;
  color?: string;
  radius?: number;
  label?: string;
}

export interface GraphSimulationNode extends GraphNode, GraphNodeStyle {}

export interface GraphSimulationEdge extends GraphEdge {
  source?: GraphSimulationNode;
  target?: GraphSimulationNode;
}
