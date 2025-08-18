import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { logger } from './logger.js';
import { integrationsRouter } from './routes/integrations.js';
import { healthRouter } from './routes/health.js';
import { jiraRouter } from './routes/jira.js';
import { planRouter } from './routes/plan.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/jira', jiraRouter);
app.use('/api/plan', planRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
	logger.error({ err }, 'Unhandled error');
	res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(config.port, () => {
	logger.info({ port: config.port }, 'Backend server started');
});
