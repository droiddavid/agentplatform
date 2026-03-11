import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService, AgentResponse } from './services/agent.service';

@Component({
  selector: 'app-agent-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agent-edit.component.html'
})
export class AgentEditComponent {
  id!: number;
  name = '';
  description = '';
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private service: AgentService, private router: Router) {
    const val = this.route.snapshot.paramMap.get('id');
    if (val) this.id = +val;
    this.load();
  }

  load() {
    if (!this.id) return;
    this.loading = true; this.error = null;
    this.service.getAgent(this.id).subscribe({ next: (a: AgentResponse) => { this.name = a.name; this.description = a.description || ''; this.loading = false; }, error: e => { this.error = e?.message || 'Failed to load'; this.loading = false; } });
  }

  submit() {
    this.loading = true; this.error = null;
    this.service.updateAgent(this.id, { name: this.name, description: this.description }).subscribe({ next: _ => { this.loading = false; this.router.navigateByUrl('/agents'); }, error: err => { this.loading = false; this.error = err?.error?.message || err?.message || 'Update failed'; } });
  }
}
