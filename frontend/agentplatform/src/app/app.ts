import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthStoreService } from './services/auth-store.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('agentplatform');
  constructor(private store: AuthStoreService, private router: Router) {}

  isLogged(): boolean { return !!this.store.getAccessToken(); }

  logout() { this.store.clear(); this.router.navigateByUrl('/signup'); }
}
