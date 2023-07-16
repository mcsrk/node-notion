import { Client } from '@notionhq/client';
/** Types */
import {
	AppendBlockChildrenParameters,
	AppendBlockChildrenResponse,
	CreatePageParameters,
	CreatePageResponse,
	GetDatabaseResponse,
	GetPageResponse,
	ListBlockChildrenResponse,
	SearchResponse,
	UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints';

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

	async searchPage(searchTerm?: string): Promise<SearchResponse> {
		const result = await this.notion.search({
			query: searchTerm,
			filter: {
				property: 'object',
				value: 'page',
			},
		});
		return result;
	}

	async getPage(pageId: string): Promise<GetPageResponse> {
		const pageResult = await this.notion.pages.retrieve({ page_id: pageId });
		const result = pageResult;
		return result;
	}
	async getPageBlockChildren(blockId: string): Promise<ListBlockChildrenResponse> {
		const childrenList = await this.notion.blocks.children.list({
			block_id: blockId,
			page_size: CONFIG.ROADMAP_TEMPLATE.RETRIEVE_BLOCKS,
		});
		const result = childrenList;
		return result;
	}

	async getDatabase(pageId: string): Promise<GetDatabaseResponse> {
		const pageResult = await this.notion.databases.retrieve({ database_id: pageId });
		const result = pageResult;
		return result;
	}

	async createPage(page: CreatePageParameters): Promise<CreatePageResponse> {
		const createdPageResponse = await this.notion.pages.create(page);
		const result = createdPageResponse;
		return result;
	}

	async archivePage(pageId: string): Promise<UpdatePageResponse> {
		const updatePageResponse = await this.notion.pages.update({
			page_id: pageId,
			archived: true,
		});
		return updatePageResponse;
	}

	async appendChildren(blocksToAppend: AppendBlockChildrenParameters): Promise<AppendBlockChildrenResponse> {
		const createdBlocksResponse = await this.notion.blocks.children.append(blocksToAppend);
		const result = createdBlocksResponse;
		return result;
	}
}
