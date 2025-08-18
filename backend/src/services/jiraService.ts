import axios, { AxiosInstance } from 'axios';
import { config } from '../config.js';

export interface JiraService {
	client: AxiosInstance;
	agileClient: AxiosInstance;
	isConfigured: boolean;
	getProjects: (params?: { query?: string; startAt?: number; maxResults?: number }) => Promise<any>;
	searchIssues: (params: { jql: string; startAt?: number; maxResults?: number; fields?: string[] }) => Promise<any>;
	getMyIssues: (params?: { startAt?: number; maxResults?: number; fields?: string[] }) => Promise<any>;
}

function buildAuthHeader(): string | undefined {
	const { jira } = config.integrations;
	if (!jira.baseUrl || !jira.email || !jira.apiToken) return undefined;
	const token = Buffer.from(`${jira.email}:${jira.apiToken}`).toString('base64');
	return `Basic ${token}`;
}

export function createJiraService(): JiraService {
	const authHeader = buildAuthHeader();
	const isConfigured = Boolean(authHeader);

	const client = axios.create({
		baseURL: `${config.integrations.jira.baseUrl?.replace(/\/$/, '')}/rest/api/3`,
		headers: authHeader
			? { Authorization: authHeader, Accept: 'application/json' }
			: { Accept: 'application/json' },
		timeout: 15000,
	});

	const agileClient = axios.create({
		baseURL: `${config.integrations.jira.baseUrl?.replace(/\/$/, '')}/rest/agile/1.0`,
		headers: authHeader
			? { Authorization: authHeader, Accept: 'application/json' }
			: { Accept: 'application/json' },
		timeout: 15000,
	});

	async function getProjects(params?: { query?: string; startAt?: number; maxResults?: number }) {
		const response = await client.get('/project/search', { params });
		return response.data;
	}

	async function searchIssues(params: { jql: string; startAt?: number; maxResults?: number; fields?: string[] }) {
		const response = await client.get('/search', {
			params: {
				jql: params.jql,
				startAt: params.startAt ?? 0,
				maxResults: Math.min(params.maxResults ?? 25, 100),
				fields: params.fields?.join(',') ?? undefined,
			},
		});
		return response.data;
	}

	async function getMyIssues(params?: { startAt?: number; maxResults?: number; fields?: string[] }) {
		return searchIssues({
			jql: 'assignee = currentUser() AND resolution = Unresolved ORDER BY updated DESC',
			startAt: params?.startAt,
			maxResults: params?.maxResults,
			fields: params?.fields,
		});
	}

	return { client, agileClient, isConfigured, getProjects, searchIssues, getMyIssues };
}
