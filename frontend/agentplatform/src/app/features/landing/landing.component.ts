import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing">
      <header class="landing-header">
        <div class="brand">AgentFlow</div>
        <nav class="landing-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a routerLink="/signup" class="btn btn-primary">Get Started</a>
        </nav>
      </header>

      <section class="hero">
        <h1>Create AI agents that work for you.</h1>
        <p>Design assistants that research, plan, write, organize, and take action — while you stay in control.</p>
        <div class="hero-cta">
          <a routerLink="/signup" class="btn btn-primary btn-lg">Get Started</a>
          <a href="#how-it-works" class="btn btn-secondary btn-lg">See How It Works</a>
        </div>
      </section>

      <section class="features" id="features">
        <h2>Why AgentFlow?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Easy Agent Creation</h3>
            <p>Create agents using templates, wizards, or plain language descriptions.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">✋</div>
            <h3>Approval-First Design</h3>
            <p>Stay in control. Agents ask before taking external actions.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Multi-Agent Teams</h3>
            <p>Let agents collaborate and delegate tasks to each other.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Your Privacy First</h3>
            <p>Export your data, delete memories, or remove your account anytime.</p>
          </div>
        </div>
      </section>

      <section class="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Describe Your Need</h3>
            <p>Tell us what you want your agent to help with.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Agent Gets to Work</h3>
            <p>Your agent researches, plans, and prepares results.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>You Stay in Control</h3>
            <p>Review and approve before any external action happens.</p>
          </div>
        </div>
      </section>

      <footer class="landing-footer">
        <p>&copy; 2026 AgentFlow. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .landing-header {
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0,0,0,0.1);
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .landing-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .landing-nav a {
      color: white;
      text-decoration: none;
      font-size: 0.95rem;
      transition: opacity 0.2s;
    }

    .landing-nav a:hover {
      opacity: 0.8;
    }

    .hero {
      text-align: center;
      padding: 6rem 2rem;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero p {
      font-size: 1.25rem;
      max-width: 600px;
      margin: 0 auto 2rem;
      opacity: 0.95;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: white;
      color: #667eea;
    }

    .btn-lg {
      padding: 1rem 2.5rem;
      font-size: 1rem;
    }

    .features {
      background: white;
      color: #333;
      padding: 4rem 2rem;
    }

    .features h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 3rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin: 0 0 0.75rem 0;
    }

    .feature-card p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }

    .how-it-works {
      padding: 4rem 2rem;
      text-align: center;
    }

    .how-it-works h2 {
      font-size: 2rem;
      margin-bottom: 3rem;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .step {
      padding: 2rem;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
    }

    .step-number {
      display: inline-block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      background: white;
      color: #667eea;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .step h3 {
      margin: 0 0 0.75rem 0;
    }

    .step p {
      margin: 0;
      opacity: 0.9;
    }

    .landing-footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid rgba(255,255,255,0.2);
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .landing-header {
        flex-direction: column;
        gap: 1rem;
      }

      .landing-nav {
        flex-direction: column;
        gap: 1rem;
      }

      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1rem;
      }
    }
  `]
})
export class LandingPageComponent {}
