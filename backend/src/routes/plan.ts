import { Router } from 'express';
import { config } from '../config.js';
import { mockPlanTasks } from '../mocks/plan.js';

export const planRouter = Router();

// GET /api/plan/tasks - returns mock tasks when mockMode is on
planRouter.get('/tasks', async (_req, res) => {
	if (config.mockMode) {
		return res.json({ tasks: mockPlanTasks });
	}
	// Non-mock mode could fetch from Jira or another planning system.
	return res.json({ tasks: mockPlanTasks });
});
