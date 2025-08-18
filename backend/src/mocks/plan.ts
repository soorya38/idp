export type PlanStatus = 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';

export interface PlanTask {
	key: string;
	summary: string;
	status: PlanStatus;
	assignee: string;
	priority: 'Low' | 'Medium' | 'High' | 'Critical';
	dueDate?: string;
	labels: string[];
}

export const mockPlanTasks: PlanTask[] = [
	{
		key: 'PLAN-101',
		summary: 'Create onboarding flow for new services',
		status: 'In Progress',
		assignee: 'soorya',
		priority: 'High',
		dueDate: '2025-08-25',
		labels: ['services', 'onboarding'],
	},
	{
		key: 'PLAN-102',
		summary: 'Add health checks to API Gateway routes',
		status: 'To Do',
		assignee: 'akilesh',
		priority: 'Medium',
		dueDate: '2025-08-28',
		labels: ['api', 'gateway'],
	},
	{
		key: 'PLAN-103',
		summary: 'Implement blue/green deploy strategy for payments',
		status: 'In Review',
		assignee: 'devopsteam',
		priority: 'High',
		dueDate: '2025-08-30',
		labels: ['deploy', 'strategy'],
	},
	{
		key: 'PLAN-104',
		summary: 'Mobile app log forwarding to central store',
		status: 'Backlog',
		assignee: 'mobile',
		priority: 'Low',
		labels: ['mobile', 'logging'],
	},
	{
		key: 'PLAN-105',
		summary: 'Add SLO dashboards for staging',
		status: 'Blocked',
		assignee: 'test',
		priority: 'Critical',
		labels: ['observability', 'slo'],
	},
	{
		key: 'PLAN-106',
		summary: 'Migrate DB migrations to timestamped files',
		status: 'Done',
		assignee: 'devopsteam',
		priority: 'Medium',
		labels: ['database', 'migrations'],
	},
];
