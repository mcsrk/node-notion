import { Client } from '@notionhq/client';
/** Types */
import { GetPageResponse, SearchResponse } from '@notionhq/client/build/src/api-endpoints';

import { CONFIG } from '../config/config';

export class NotionClient {
	notion: Client;

	constructor() {
		if (!CONFIG.NOTION.INTEGRATION_TOKEN) {
			throw new Error('No Notion Integration Token in .env');
		}

		this.notion = new Client({
			auth: CONFIG.NOTION.INTEGRATION_TOKEN,
		});
	}

	async searchPageOrDatabase(searchTerm?: string): Promise<SearchResponse> {
		const result = await this.notion.search({ query: searchTerm });
		return result;
	}

	async getPage(pageId: string): Promise<GetPageResponse> {
		const pageResult = await this.notion.pages.retrieve({ page_id: pageId });
		const result = pageResult;
		return result;
	}
}
