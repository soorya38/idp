export const mockJiraProjects = {
	self: 'http://mock/jira/project/search',
	nextPage: null,
	maxResults: 50,
	startAt: 0,
	total: 3,
	values: [
		{ id: '10001', key: 'PLAT', name: 'Platform' },
		{ id: '10002', key: 'IDP', name: 'Internal Developer Platform' },
		{ id: '10003', key: 'OBS', name: 'Observability' },
	],
};

export const mockJiraIssuesMine = {
	expand: 'schema,names',
	startAt: 0,
	maxResults: 25,
	total: 5,
	issues: [
		{
			id: '20001',
			key: 'IDP-101',
			fields: {
				summary: 'Implement backend mock mode',
				status: { name: 'In Progress', statusCategory: { key: 'indeterminate', name: 'In Progress' } },
				issuetype: { name: 'Task' },
				updated: new Date().toISOString(),
			},
		},
		{
			id: '20002',
			key: 'IDP-102',
			fields: {
				summary: 'Wire Jira view to backend',
				status: { name: 'To Do', statusCategory: { key: 'new', name: 'To Do' } },
				issuetype: { name: 'Story' },
				updated: new Date().toISOString(),
			},
		},
		{
			id: '20003',
			key: 'IDP-103',
			fields: {
				summary: 'Unblock deployment pipeline',
				status: { name: 'Blocked', statusCategory: { key: 'indeterminate', name: 'In Progress' } },
				issuetype: { name: 'Bug' },
				updated: new Date().toISOString(),
			},
		},
		{
			id: '20004',
			key: 'IDP-104',
			fields: {
				summary: 'Migrate docs to Confluence',
				status: { name: 'Resolved', statusCategory: { key: 'done', name: 'Done' } },
				issuetype: { name: 'Task' },
				updated: new Date().toISOString(),
			},
		},
		{
			id: '20005',
			key: 'IDP-105',
			fields: {
				summary: 'Clean up old branches',
				status: { name: 'Closed', statusCategory: { key: 'done', name: 'Done' } },
				issuetype: { name: 'Task' },
				updated: new Date().toISOString(),
			},
		},
	],
};
