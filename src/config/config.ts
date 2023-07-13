import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000;
const NOTION_INTEGRATION_TOKEN = process.env.NOTION_INTEGRATION_TOKEN || '';

export const CONFIG = Object.freeze({
	SERVER: {
		PORT: SERVER_PORT,
	},
	NOTION: {
		INTEGRATION_TOKEN: NOTION_INTEGRATION_TOKEN,
	},
});
