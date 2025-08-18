import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: process.env.BACKEND_ENV_PATH ?? undefined });

const EnvSchema = z.object({
	PORT: z.string().default('3001'),
	CORS_ORIGIN: z.string().default('http://localhost:5173'),
	BACKEND_MOCK: z.string().default('true'),
	// OAuth and tokens for integrations (placeholders)
	GITHUB_TOKEN: z.string().optional(),
	JIRA_BASE_URL: z.string().url().optional(),
	JIRA_EMAIL: z.string().optional(),
	JIRA_API_TOKEN: z.string().optional(),
	CONFLUENCE_BASE_URL: z.string().url().optional(),
	ARGOCD_BASE_URL: z.string().url().optional(),
	ARGOCD_TOKEN: z.string().optional(),
	AWS_REGION: z.string().optional(),
	GOOGLE_PROJECT_ID: z.string().optional(),
	GRAFANA_URL: z.string().url().optional(),
	LOKI_URL: z.string().url().optional(),
	PROMETHEUS_URL: z.string().url().optional(),
});

const env = EnvSchema.parse(process.env);

export const config = {
	port: Number(env.PORT),
	corsOrigin: env.CORS_ORIGIN,
	mockMode: env.BACKEND_MOCK === 'true',
	integrations: {
		githubToken: env.GITHUB_TOKEN,
		jira: {
			baseUrl: env.JIRA_BASE_URL,
			email: env.JIRA_EMAIL,
			apiToken: env.JIRA_API_TOKEN,
		},
		confluence: {
			baseUrl: env.CONFLUENCE_BASE_URL,
		},
		argocd: {
			baseUrl: env.ARGOCD_BASE_URL,
			token: env.ARGOCD_TOKEN,
		},
		aws: {
			region: env.AWS_REGION,
		},
		google: {
			projectId: env.GOOGLE_PROJECT_ID,
		},
		grafanaUrl: env.GRAFANA_URL,
		lokiUrl: env.LOKI_URL,
		prometheusUrl: env.PROMETHEUS_URL,
	},
};
