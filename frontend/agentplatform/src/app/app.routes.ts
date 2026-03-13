import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
	// Landing page (public, no shell)
	{ path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingPageComponent) },

	// Signup (public with PublicShellComponent)
	{ 
		path: 'signup', 
		loadComponent: () => import('./shared/shells/public-shell.component').then(m => m.PublicShellComponent),
		children: [
			{ path: '', loadComponent: () => import('./sign-up.component').then(m => m.SignUpComponent) }
		]
	},

	// Signin (public with PublicShellComponent)
	{ 
		path: 'signin', 
		loadComponent: () => import('./shared/shells/public-shell.component').then(m => m.PublicShellComponent),
		children: [
			{ path: '', loadComponent: () => import('./sign-in.component').then(m => m.SignInComponent) }
		]
	},

	// Protected routes wrapped in AppShellComponent
	{
		path: 'dashboard',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) }
		]
	},

	{
		path: 'agents',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./components/agent-management/agent-list.component').then(m => m.AgentListComponent) },
			{ path: 'wizard', loadComponent: () => import('./components/agent-management/agent-wizard.component').then(m => m.AgentWizardComponent) },
			{ path: 'from-text', loadComponent: () => import('./components/agent-management/natural-language-builder.component').then(m => m.NaturalLanguageBuilderComponent) },
			{ path: 'create', loadComponent: () => import('./components/agent-management/agent-create.component').then(m => m.AgentCreateComponent) },
			{ path: ':id/edit', loadComponent: () => import('./components/agent-management/agent-edit.component').then(m => m.AgentEditComponent) },
			{ path: ':id', loadComponent: () => import('./components/agent-management/agent-detail.component').then(m => m.AgentDetailComponent) }
		]
	},

	{
		path: 'templates',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./templates-list.component').then(m => m.TemplatesListComponent) },
			{ path: ':id', loadComponent: () => import('./template-detail.component').then(m => m.TemplateDetailComponent) }
		]
	},

	{
		path: 'profile',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./profile.component').then(m => m.ProfileComponent) }
		]
	},

	{
		path: 'tasks',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) },
			{ path: ':id', loadComponent: () => import('./components/task-detail/task-detail.component').then(m => m.TaskDetailComponent) }
		]
	},

	{
		path: 'runs',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'approvals',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'connections',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'documents',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'billing',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'settings',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	{
		path: 'help',
		loadComponent: () => import('./shared/shells/app-shell.component').then(m => m.AppShellComponent),
		canActivate: [AuthGuard],
		children: [
			{ path: '', loadComponent: () => import('./shared/components/empty-state.component').then(m => m.EmptyStateComponent) }
		]
	},

	// Fallback to dashboard for authenticated users, landing for public
	{ path: '**', redirectTo: '' }
];
