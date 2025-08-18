import { Router } from 'express';
import { config } from '../config.js';

const mock = {
	github: { items: [{ id: 1, name: 'idp-frontend' }, { id: 2, name: 'idp-backend' }] },
	confluence: { pages: [{ id: 'p1', title: 'Runbook' }, { id: 'p2', title: 'ADR: Architecture' }] },
	argocd: { applications: [{ name: 'user-service' }, { name: 'api-gateway' }] },
	aws: { region: 'us-east-1', resources: [{ type: 'ec2', count: 12 }, { type: 'rds', count: 3 }] },
	google: { projectId: 'demo-project', resources: [{ type: 'gke', count: 2 }] },
	grafana: { dashboards: [{ uid: 'abc', title: 'System Overview' }, { uid: 'xyz', title: 'Services' }] },
	loki: { labels: ['app', 'env', 'pod'] },
	prometheus: { data: { result: [{ metric: { job: 'node' }, value: [Date.now() / 1000, '1'] }] } },
};

export const integrationsRouter = Router();

integrationsRouter.get('/github/repos', async (_req, res) => {
	if (config.mockMode) return res.json(mock.github);
	if (!config.integrations.githubToken) return res.status(501).json({ error: 'GitHub not configured' });
	return res.json({ items: [] });
});

integrationsRouter.get('/jira/issues', async (_req, res) => {
	if (config.mockMode) return res.json({ issues: [] });
	if (!config.integrations.jira.baseUrl || !config.integrations.jira.apiToken || !config.integrations.jira.email) {
		return res.status(501).json({ error: 'Jira not configured' });
	}
	return res.json({ issues: [] });
});

integrationsRouter.get('/confluence/pages', async (_req, res) => {
	if (config.mockMode) return res.json(mock.confluence);
	if (!config.integrations.confluence.baseUrl) return res.status(501).json({ error: 'Confluence not configured' });
	return res.json({ pages: [] });
});

integrationsRouter.get('/argocd/apps', async (_req, res) => {
	if (config.mockMode) return res.json(mock.argocd);
	if (!config.integrations.argocd.baseUrl || !config.integrations.argocd.token) return res.status(501).json({ error: 'ArgoCD not configured' });
	return res.json({ applications: [] });
});

integrationsRouter.get('/aws/summary', async (_req, res) => {
	if (config.mockMode) return res.json(mock.aws);
	if (!config.integrations.aws.region) return res.status(501).json({ error: 'AWS not configured' });
	return res.json({ region: config.integrations.aws.region, resources: [] });
});

integrationsRouter.get('/google/summary', async (_req, res) => {
	if (config.mockMode) return res.json(mock.google);
	if (!config.integrations.google.projectId) return res.status(501).json({ error: 'Google not configured' });
	return res.json({ projectId: config.integrations.google.projectId, resources: [] });
});

integrationsRouter.get('/grafana/dashboards', async (_req, res) => {
	if (config.mockMode) return res.json(mock.grafana);
	if (!config.integrations.grafanaUrl) return res.status(501).json({ error: 'Grafana not configured' });
	return res.json({ dashboards: [] });
});

integrationsRouter.get('/loki/labels', async (_req, res) => {
	if (config.mockMode) return res.json(mock.loki);
	if (!config.integrations.lokiUrl) return res.status(501).json({ error: 'Loki not configured' });
	return res.json({ labels: [] });
});

integrationsRouter.get('/prometheus/query', async (req, res) => {
	if (config.mockMode) return res.json(mock.prometheus);
	if (!config.integrations.prometheusUrl) return res.status(501).json({ error: 'Prometheus not configured' });
	const query = typeof req.query.query === 'string' ? req.query.query : undefined;
	if (!query) return res.status(400).json({ error: 'Missing query' });
	return res.json({ data: { result: [] } });
});
