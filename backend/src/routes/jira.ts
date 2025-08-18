import { Router } from 'express';
import { createJiraService } from '../services/jiraService.js';
import { config } from '../config.js';
import { mockJiraIssuesMine, mockJiraProjects } from '../mocks/jira.js';

export const jiraRouter = Router();

jiraRouter.use((req, res, next) => {
	if (config.mockMode) {
		return next();
	}
	const service = createJiraService();
	(req as any).jiraService = service;
	if (!service.isConfigured) {
		return res.status(501).json({ error: 'Jira not configured' });
	}
	next();
});

jiraRouter.get('/projects', async (req, res) => {
	const baseUrl = (config.integrations.jira.baseUrl ?? 'https://your-domain.atlassian.net').replace(/\/$/, '');
	if (config.mockMode) {
		const enhanced = {
			...mockJiraProjects,
			values: mockJiraProjects.values.map((p) => ({
				...p,
				projectUrl: `${baseUrl}/jira/projects/${p.key}/summary`,
				boardUrl: `${baseUrl}/jira/software/c/projects/${p.key}/boards`,
			})),
		};
		return res.json(enhanced);
	}
	const service = (req as any).jiraService;
	try {
		const data = await service.getProjects({
			query: typeof req.query.query === 'string' ? req.query.query : undefined,
			startAt: Number(req.query.startAt ?? 0),
			maxResults: Number(req.query.maxResults ?? 25),
		});
		const enhanced = {
			...data,
			values: Array.isArray(data.values)
				? data.values.map((p: any) => ({
					...p,
					projectUrl: `${baseUrl}/jira/projects/${p.key}/summary`,
					boardUrl: `${baseUrl}/jira/software/c/projects/${p.key}/boards`,
				}))
				: [],
		};
		return res.json(enhanced);
	} catch (err: any) {
		return res.status(err?.response?.status ?? 500).json({ error: 'Jira API error', details: err?.response?.data ?? null });
	}
});

jiraRouter.get('/issues/search', async (req, res) => {
	const baseUrl = (config.integrations.jira.baseUrl ?? 'https://your-domain.atlassian.net').replace(/\/$/, '');
	if (config.mockMode) {
		const query = typeof req.query.jql === 'string' ? req.query.jql : '';
		const all = mockJiraIssuesMine.issues;
		const filtered = query && query.toLowerCase().includes('idp') ? all : all;
		const enhanced = {
			...mockJiraIssuesMine,
			issues: filtered.map((i: any) => ({ ...i, webUrl: `${baseUrl}/browse/${i.key}` })),
		};
		return res.json(enhanced);
	}
	const service = (req as any).jiraService;
	const jql = typeof req.query.jql === 'string' ? req.query.jql : undefined;
	if (!jql) return res.status(400).json({ error: 'Missing jql' });
	try {
		const data = await service.searchIssues({
			jql,
			startAt: Number(req.query.startAt ?? 0),
			maxResults: Number(req.query.maxResults ?? 25),
			fields: typeof req.query.fields === 'string' ? req.query.fields.split(',') : undefined,
		});
		const enhanced = {
			...data,
			issues: Array.isArray(data.issues)
				? data.issues.map((i: any) => ({ ...i, webUrl: `${baseUrl}/browse/${i.key}` }))
				: [],
		};
		return res.json(enhanced);
	} catch (err: any) {
		return res.status(err?.response?.status ?? 500).json({ error: 'Jira API error', details: err?.response?.data ?? null });
	}
});

jiraRouter.get('/issues/mine', async (req, res) => {
	const baseUrl = (config.integrations.jira.baseUrl ?? 'https://your-domain.atlassian.net').replace(/\/$/, '');
	if (config.mockMode) {
		const enhanced = {
			...mockJiraIssuesMine,
			issues: mockJiraIssuesMine.issues.map((i: any) => ({ ...i, webUrl: `${baseUrl}/browse/${i.key}` })),
		};
		return res.json(enhanced);
	}
	const service = (req as any).jiraService;
	try {
		const data = await service.getMyIssues({
			startAt: Number(req.query.startAt ?? 0),
			maxResults: Number(req.query.maxResults ?? 25),
			fields: typeof req.query.fields === 'string' ? req.query.fields.split(',') : undefined,
		});
		const enhanced = {
			...data,
			issues: Array.isArray(data.issues)
				? data.issues.map((i: any) => ({ ...i, webUrl: `${baseUrl}/browse/${i.key}` }))
				: [],
		};
		return res.json(enhanced);
	} catch (err: any) {
		return res.status(err?.response?.status ?? 500).json({ error: 'Jira API error', details: err?.response?.data ?? null });
	}
});

jiraRouter.get('/issues/mine/grouped', async (req, res) => {
	const baseUrl = (config.integrations.jira.baseUrl ?? 'https://your-domain.atlassian.net').replace(/\/$/, '');
	const groupKeys = ['open', 'inprogress', 'blocked', 'completed', 'closed'] as const;
	function groupIssues(issues: any[]) {
		const groups: Record<typeof groupKeys[number], any[]> = {
			open: [], inprogress: [], blocked: [], completed: [], closed: [],
		};
		for (const issue of issues) {
			const statusName = String(issue.fields?.status?.name ?? '').toLowerCase();
			const categoryKey = String(issue.fields?.status?.statusCategory?.key ?? '').toLowerCase();
			const withUrl = { ...issue, webUrl: `${baseUrl}/browse/${issue.key}` };
			if (statusName.includes('block')) {
				groups.blocked.push(withUrl);
				continue;
			}
			if (categoryKey === 'new') {
				groups.open.push(withUrl);
				continue;
			}
			if (categoryKey === 'indeterminate') {
				if (statusName.includes('progress')) groups.inprogress.push(withUrl);
				else groups.inprogress.push(withUrl);
				continue;
			}
			if (categoryKey === 'done') {
				if (statusName.includes('closed')) groups.closed.push(withUrl);
				else groups.completed.push(withUrl);
				continue;
			}
			groups.open.push(withUrl);
		}
		return groups;
	}

	if (config.mockMode) {
		return res.json({
			groups: groupIssues(mockJiraIssuesMine.issues),
			total: mockJiraIssuesMine.total,
		});
	}

	const service = (req as any).jiraService;
	try {
		const data = await service.getMyIssues({
			startAt: Number(req.query.startAt ?? 0),
			maxResults: Number(req.query.maxResults ?? 50),
			fields: typeof req.query.fields === 'string' ? req.query.fields.split(',') : ['summary', 'status', 'issuetype', 'updated'],
		});
		return res.json({ groups: groupIssues(data.issues ?? []), total: data.total ?? 0 });
	} catch (err: any) {
		return res.status(err?.response?.status ?? 500).json({ error: 'Jira API error', details: err?.response?.data ?? null });
	}
});

// Grouped issues for a selected project key
jiraRouter.get('/projects/:projectKey/issues/grouped', async (req, res) => {
	const baseUrl = (config.integrations.jira.baseUrl ?? 'https://your-domain.atlassian.net').replace(/\/$/, '');
	const { projectKey } = req.params as { projectKey: string };
	const normalizedKey = (projectKey || '').toUpperCase();
	const groupKeys = ['open', 'inprogress', 'blocked', 'completed', 'closed'] as const;
	function groupIssues(issues: any[]) {
		const groups: Record<typeof groupKeys[number], any[]> = {
			open: [], inprogress: [], blocked: [], completed: [], closed: [],
		};
		for (const issue of issues) {
			const statusName = String(issue.fields?.status?.name ?? '').toLowerCase();
			const categoryKey = String(issue.fields?.status?.statusCategory?.key ?? '').toLowerCase();
			const withUrl = { ...issue, webUrl: `${baseUrl}/browse/${issue.key}` };
			if (statusName.includes('block')) { groups.blocked.push(withUrl); continue; }
			if (categoryKey === 'new') { groups.open.push(withUrl); continue; }
			if (categoryKey === 'indeterminate') { groups.inprogress.push(withUrl); continue; }
			if (categoryKey === 'done') { if (statusName.includes('closed')) groups.closed.push(withUrl); else groups.completed.push(withUrl); continue; }
			groups.open.push(withUrl);
		}
		return groups;
	}

	if (config.mockMode) {
		const filtered = (mockJiraIssuesMine.issues || []).filter((i: any) => String(i.key || '').toUpperCase().startsWith(`${normalizedKey}-`));
		return res.json({
			groups: groupIssues(filtered),
			total: filtered.length,
		});
	}

	const service = (req as any).jiraService;
	try {
		const jql = `project = ${normalizedKey} AND assignee = currentUser() ORDER BY updated DESC`;
		const data = await service.searchIssues({
			jql,
			startAt: Number(req.query.startAt ?? 0),
			maxResults: Number(req.query.maxResults ?? 50),
			fields: typeof req.query.fields === 'string' ? req.query.fields.split(',') : ['summary', 'status', 'issuetype', 'updated'],
		});
		return res.json({ groups: groupIssues(data.issues ?? []), total: data.total ?? 0 });
	} catch (err: any) {
		return res.status(err?.response?.status ?? 500).json({ error: 'Jira API error', details: err?.response?.data ?? null });
	}
});
