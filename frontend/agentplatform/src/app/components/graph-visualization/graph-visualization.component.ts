import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GraphService } from '../../services/graph.service';
import { GraphView, GraphNode, GraphEdge, GraphSimulationNode, GraphSimulationEdge } from '../../models/graph.model';

interface SimulationNode extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

interface SimulationEdge extends GraphEdge {
  source?: SimulationNode;
  target?: SimulationNode;
}

@Component({
  selector: 'app-graph-visualization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="graph-container">
      <div class="graph-header">
        <h3>Execution Graph</h3>
        <div class="graph-controls">
          <button (click)="resetZoom()" title="Reset zoom">🔍 Reset</button>
          <button (click)="togglePhysics()" [class.active]="physicsRunning" title="Toggle physics simulation">
            {{ physicsRunning ? '⏸ Pause' : '▶ Play' }}
          </button>
          <select [(ngModel)]="filterByType" (change)="applyFilter()" title="Filter edges by type">
            <option value="">All Edges</option>
            <option value="message">Messages</option>
            <option value="delegation">Delegations</option>
            <option value="spawn">Spawns</option>
          </select>
        </div>
      </div>

      <div class="graph-canvas-wrapper">
        <svg #canvas class="graph-canvas" 
             (wheel)="onWheel($event)" 
             (mousedown)="onMouseDown($event)"
             (mousemove)="onMouseMove($event)"
             (mouseup)="onMouseUp($event)"
             (mouseleave)="onMouseUp($event)">
          <!-- Graph rendering will be done with D3-style transform -->
          <g #graphGroup class="graph-group">
            <!-- Edges/Links -->
            <g class="edges-group">
              <line *ngFor="let edge of simulationEdges" 
                    [attr.x1]="edge.source?.x || 0" 
                    [attr.y1]="edge.source?.y || 0"
                    [attr.x2]="edge.target?.x || 0" 
                    [attr.y2]="edge.target?.y || 0"
                    [class.edge-link]="true"
                    [class]="'edge-' + edge.type"
                    [attr.stroke-dasharray]="edge.type === 'message' ? '5,5' : 'none'"
                    (mouseenter)="onEdgeHover(edge)"
                    (mouseleave)="onEdgeLeave()"
                    (click)="onEdgeClick(edge)"
                    [id]="'edge-' + edge.id">
              </line>
              <!-- Edge labels -->
              <text *ngFor="let edge of simulationEdges"
                    [attr.x]="((edge.source?.x || 0) + (edge.target?.x || 0)) / 2"
                    [attr.y]="((edge.source?.y || 0) + (edge.target?.y || 0)) / 2 - 5"
                    class="edge-label"
                    [style.display]="edge.label ? 'block' : 'none'">
                {{ edge.label }}
              </text>
            </g>

            <!-- Nodes -->
            <g class="nodes-group">
              <circle *ngFor="let node of simulationNodes"
                      [attr.cx]="node.x || 0"
                      [attr.cy]="node.y || 0"
                      [attr.r]="getNodeRadius(node)"
                      [class]="'node node-' + node.type"
                      [attr.fill]="getNodeColor(node)"
                      [class.node-hover]="hoveredNodeId === node.id"
                      (mouseenter)="onNodeHover(node)"
                      (mouseleave)="onNodeLeave()"
                      (click)="onNodeClick(node)"
                      [id]="'node-' + node.id"
                      draggable="true"
                      (dragstart)="onNodeDragStart($event, node)"
                      (drag)="onNodeDrag($event, node)"
                      (dragend)="onNodeDragEnd($event, node)">
              </circle>

              <!-- Node labels -->
              <text *ngFor="let node of simulationNodes"
                    [attr.x]="node.x || 0"
                    [attr.y]="node.y || 0"
                    class="node-label"
                    text-anchor="middle"
                    dy=".3em">
                {{ getTruncatedLabel(node) }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Hover tooltip for nodes -->
        <div *ngIf="hoveredNode" class="tooltip node-tooltip" 
             [style.left.px]="tooltipX" 
             [style.top.px]="tooltipY">
          <div class="tooltip-header">{{ hoveredNode.agentName }}</div>
          <div class="tooltip-body">
            <div><strong>Type:</strong> {{ hoveredNode.type }}</div>
            <div><strong>Status:</strong> {{ hoveredNode.status || 'N/A' }}</div>
            <div *ngIf="hoveredNode.metadata">
              <strong>Details:</strong> {{ hoveredNode.metadata | json }}
            </div>
          </div>
        </div>

        <!-- Hover tooltip for edges -->
        <div *ngIf="hoveredEdge" class="tooltip edge-tooltip" 
             [style.left.px]="tooltipX" 
             [style.top.px]="tooltipY">
          <div class="tooltip-header">{{ hoveredEdge.type }} Edge</div>
          <div class="tooltip-body">
            <div><strong>Label:</strong> {{ hoveredEdge.label || 'N/A' }}</div>
            <div><strong>Type:</strong> {{ hoveredEdge.messageType || hoveredEdge.type }}</div>
          </div>
        </div>
      </div>

      <!-- Graph stats panel -->
      <div class="graph-stats">
        <span><strong>Nodes:</strong> {{ simulationNodes.length }}</span>
        <span><strong>Edges:</strong> {{ simulationEdges.length }}</span>
        <span *ngIf="graphData?.statistics">
          <strong>Types:</strong> {{ getNodeTypeCounts() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .graph-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #f5f5f5;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .graph-header h3 {
      margin: 0;
      font-size: 16px;
    }

    .graph-controls {
      display: flex;
      gap: 8px;
    }

    .graph-controls button,
    .graph-controls select {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: rgba(255,255,255,0.2);
      color: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .graph-controls button:hover,
    .graph-controls select:hover {
      background: rgba(255,255,255,0.3);
    }

    .graph-controls button.active {
      background: rgba(255,255,255,0.5);
      font-weight: bold;
    }

    .graph-controls select {
      background: rgba(255,255,255,0.2);
    }

    .graph-canvas-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: white;
    }

    .graph-canvas {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
      cursor: grab;
    }

    .graph-canvas:active {
      cursor: grabbing;
    }

    .edges-group line.edge-link {
      stroke: #999;
      stroke-width: 2;
      fill: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edges-group line.edge-link:hover {
      stroke: #f97316;
      stroke-width: 3;
    }

    .edges-group line.edge-message {
      stroke: #3b82f6;
    }

    .edges-group line.edge-delegation {
      stroke: #10b981;
    }

    .edges-group line.edge-spawn {
      stroke: #f59e0b;
    }

    .edge-label {
      font-size: 11px;
      fill: #666;
      text-anchor: middle;
      pointer-events: none;
    }

    .nodes-group circle.node {
      fill: #667eea;
      stroke: #fff;
      stroke-width: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }

    .nodes-group circle.node:hover,
    .nodes-group circle.node-hover {
      fill: #764ba2;
      stroke-width: 3px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .nodes-group circle.node-agent {
      fill: #667eea;
    }

    .nodes-group circle.node-task {
      fill: #f59e0b;
    }

    .nodes-group circle.node-execution_event {
      fill: #10b981;
    }

    .node-label {
      font-size: 12px;
      fill: white;
      font-weight: 500;
      pointer-events: none;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .tooltip {
      position: absolute;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      pointer-events: none;
      white-space: nowrap;
    }

    .tooltip-header {
      font-weight: bold;
      margin-bottom: 4px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 4px;
    }

    .tooltip-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .graph-stats {
      display: flex;
      justify-content: space-around;
      padding: 12px 16px;
      background: #f0f0f0;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #666;
    }

    .graph-stats span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `]
})
export class GraphVisualizationComponent implements OnInit, OnDestroy {
  @Input() runId: string = '';
  @ViewChild('canvas') canvasRef?: ElementRef;
  @ViewChild('graphGroup') graphGroupRef?: ElementRef;

  graphData?: GraphView;
  simulationNodes: SimulationNode[] = [];
  simulationEdges: SimulationEdge[] = [];
  
  hoveredNode?: GraphNode;
  hoveredEdge?: GraphEdge;
  hoveredNodeId?: string;
  tooltipX: number = 0;
  tooltipY: number = 0;
  
  filterByType: string = '';
  physicsRunning: boolean = true;
  
  private destroy$ = new Subject<void>();
  private zoomLevel: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private animationFrameId?: number;
  private nodeBeingDragged?: SimulationNode;

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    if (this.runId) {
      this.loadGraph();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  loadGraph(): void {
    this.graphService.getGraphView(this.runId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.graphData = data;
          this.initializeSimulation();
          this.startPhysicsSimulation();
        },
        error: (err) => console.error('Failed to load graph:', err)
      });
  }

  private initializeSimulation(): void {
    if (!this.graphData) return;

    // Initialize nodes with random positions
    const width = this.canvasRef?.nativeElement.clientWidth || 800;
    const height = this.canvasRef?.nativeElement.clientHeight || 600;

    this.simulationNodes = this.graphData.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }));

    // Map nodes to edges
    this.simulationEdges = this.graphData.edges.map(edge => ({
      ...edge,
      source: this.simulationNodes.find(n => n.id === edge.fromNodeId),
      target: this.simulationNodes.find(n => n.id === edge.toNodeId)
    }));

    this.applyFilter();
  }

  private startPhysicsSimulation(): void {
    const simulate = () => {
      if (this.physicsRunning && this.simulationNodes.length > 0) {
        this.updateForces();
      }
      this.animationFrameId = requestAnimationFrame(simulate);
    };
    simulate();
  }

  private updateForces(): void {
    const alpha = 0.1;
    const chargeStrength = -30;
    const linkDistance = 100;

    // Clear forces
    for (const node of this.simulationNodes) {
      if (!node.fx && !node.fy) {
        node.vx = (node.vx || 0) * 0.9;
        node.vy = (node.vy || 0) * 0.9;
      }
    }

    // Repulsive forces (Coulomb)
    for (let i = 0; i < this.simulationNodes.length; i++) {
      for (let j = i + 1; j < this.simulationNodes.length; j++) {
        const a = this.simulationNodes[i];
        const b = this.simulationNodes[j];
        const dx = (b.x || 0) - (a.x || 0);
        const dy = (b.y || 0) - (a.y || 0);
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = chargeStrength / (distance * distance);

        if (!a.fx) a.vx = (a.vx || 0) + (force * dx / distance);
        if (!a.fy) a.vy = (a.vy || 0) + (force * dy / distance);
        if (!b.fx) b.vx = (b.vx || 0) - (force * dx / distance);
        if (!b.fy) b.vy = (b.vy || 0) - (force * dy / distance);
      }
    }

    // Attractive forces (spring)
    for (const edge of this.simulationEdges) {
      if (edge.source && edge.target) {
        const dx = (edge.target.x || 0) - (edge.source.x || 0);
        const dy = (edge.target.y || 0) - (edge.source.y || 0);
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = (distance - linkDistance) / distance;

        if (!edge.source.fx) edge.source.vx = (edge.source.vx || 0) + force * dx;
        if (!edge.source.fy) edge.source.vy = (edge.source.vy || 0) + force * dy;
        if (!edge.target.fx) edge.target.vx = (edge.target.vx || 0) - force * dx;
        if (!edge.target.fy) edge.target.vy = (edge.target.vy || 0) - force * dy;
      }
    }

    // Update positions
    for (const node of this.simulationNodes) {
      if (!node.fx) {
        node.x = (node.x || 0) + (node.vx || 0) * alpha;
      }
      if (!node.fy) {
        node.y = (node.y || 0) + (node.vy || 0) * alpha;
      }
    }
  }

  getNodeRadius(node: GraphNode): number {
    return node.type === 'agent' ? 20 : 15;
  }

  getNodeColor(node: GraphNode): string {
    const colors: Record<string, string> = {
      agent: '#667eea',
      task: '#f59e0b',
      execution_event: '#10b981'
    };
    return colors[node.type] || '#667eea';
  }

  getTruncatedLabel(node: GraphNode): string {
    const label = node.agentName || node.id?.substring(0, 4) || '?';
    return label.substring(0, 8);
  }

  onNodeHover(node: GraphNode, event?: MouseEvent): void {
    this.hoveredNode = node;
    this.hoveredNodeId = node.id;
    this.hoveredEdge = undefined;
    if (event) {
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    }
  }

  onNodeLeave(): void {
    this.hoveredNode = undefined;
    this.hoveredNodeId = undefined;
  }

  onEdgeHover(edge: GraphEdge, event?: MouseEvent): void {
    this.hoveredEdge = edge;
    this.hoveredNode = undefined;
    if (event) {
      this.tooltipX = event.clientX + 10;
      this.tooltipY = event.clientY + 10;
    }
  }

  onEdgeLeave(): void {
    this.hoveredEdge = undefined;
  }

  onNodeClick(node: GraphNode): void {
    console.log('Node clicked:', node);
    // Could emit event or open detail panel
  }

  onEdgeClick(edge: GraphEdge): void {
    console.log('Edge clicked:', edge);
    // Could emit event or open detail panel
  }

  onNodeDragStart(event: DragEvent, node: SimulationNode): void {
    this.nodeBeingDragged = node;
    node.fx = node.x;
    node.fy = node.y;
  }

  onNodeDrag(event: DragEvent, node: SimulationNode): void {
    if (this.nodeBeingDragged && event.clientX > 0 && event.clientY > 0) {
      node.fx = event.clientX - (this.canvasRef?.nativeElement.getBoundingClientRect().left || 0);
      node.fy = event.clientY - (this.canvasRef?.nativeElement.getBoundingClientRect().top || 0);
    }
  }

  onNodeDragEnd(event: DragEvent, node: SimulationNode): void {
    this.nodeBeingDragged = undefined;
    // Keep position fixed
  }

  onMouseDown(event: MouseEvent): void {
    if ((event.target as SVGElement).tagName === 'svg') {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      this.panX += dx;
      this.panY += dy;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.applyTransformInternal();
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1;
    this.zoomLevel *= zoomDelta;
    this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel));
    this.applyTransformInternal();
  }

  applyTransformInternal(): void {
    if (this.graphGroupRef) {
      const transform = `translate(${this.panX},${this.panY}) scale(${this.zoomLevel})`;
      (this.graphGroupRef.nativeElement as SVGGElement).setAttribute('transform', transform);
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyTransformInternal();
  }

  togglePhysics(): void {
    this.physicsRunning = !this.physicsRunning;
  }

  applyFilter(): void {
    // Filter edges based on selected type
    if (this.filterByType) {
      this.simulationEdges = (this.graphData?.edges || [])
        .filter(e => e.type === this.filterByType)
        .map((edge) => ({
          ...edge,
          source: this.simulationNodes.find((n) => (n as any).id === edge.fromNodeId) as SimulationNode,
          target: this.simulationNodes.find((n) => (n as any).id === edge.toNodeId) as SimulationNode
        }));
    } else {
      this.initializeSimulation();
    }
  }

  getNodeTypeCounts(): string {
    const counts: Record<string, number> = {};
    for (const node of this.simulationNodes) {
      const nodeType = (node as any).type;
      counts[nodeType] = (counts[nodeType] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([type, count]) => `${type}:${count}`)
      .join(', ');
  }
}
