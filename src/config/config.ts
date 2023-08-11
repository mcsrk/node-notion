import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000;
const NOTION_INTEGRATION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN || '';
const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN || '';

export const CONFIG = Object.freeze({
	SERVER: {
		PORT: SERVER_PORT,
	},
	NOTION: {
		INTEGRATION_TOKEN: NOTION_INTEGRATION_TOKEN,
	},
	SYNAP: {
		API: {
			// Synap API Docs config
			maxBodyLength: Infinity,
			url: 'https://api-org.synap.ac/status',
			headers: {
				'X-Syn-Org-Secret': ' < Your organisation secret key >',
				'X-Syn-Org-id': ' < Your organisation identifier >',
				'X-api-key': ' < Your API Key >',
			},
		},
		LAMBDA: {
			SET_UP: {
				maxBodyLength: Infinity,
				url: 'https://sf6ef7oa36qazqzsbazx7jv2vy0bcldt.lambda-url.eu-west-2.on.aws/',
				headers: {
					'Content-Type': 'application/json',
				},
			},
			// Synap Custom Endpoint made by James from Synap
			portalId: '1t8EUQEApb',
			API_KEY: '<<SCHOLARLY_API_KEY>>',
		},
	},
	ROADMAP_TEMPLATE: {
		RETRIEVE_BLOCKS: 100, // Max 100
		OVERRIDE_BLOCKS: 100, // Max 100
		STUDENTS_COLLECTION_PAGE_NAME: 'Scholary Roadmaps',
	},
	AIRTABLE: { ACCESS_TOKEN: AIRTABLE_ACCESS_TOKEN },
});
