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
	QueryDatabaseParameters,
	QueryDatabaseResponse,
	SearchResponse,
	UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Config
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';

const FILE_TAG = '[NotionClient]';

export class NotionClient {
	notion: Client;

	constructor() {
		if (!CONFIG.NOTION.INTEGRATION_TOKEN) {
			throw new Error(`${FILE_TAG} No Notion Integration Token in .env`);
		}

		this.notion = new Client({
			auth: CONFIG.NOTION.INTEGRATION_TOKEN,
		});
	}

	async searchPage(searchTerm?: string): Promise<SearchResponse> {
		const FUNC_TAG = '.[searchPage]';
		Logging.info(`${FILE_TAG}${FUNC_TAG} Searching page: ${searchTerm}`);
		const result = await this.notion.search({
			query: searchTerm,
			filter: {
				property: 'object',
				value: 'page',
			},
		});
		return result;
	}

	async searchDatabase(searchTerm?: string): Promise<SearchResponse> {
		const FUNC_TAG = '.[searchDatabase]';
		Logging.info(`${FILE_TAG}${FUNC_TAG} Searching database: ${searchTerm}`);
		const result = await this.notion.search({
			query: searchTerm,
			filter: {
				property: 'object',
				value: 'database',
			},
		});
		return result;
	}

	async queryDatabase(queryParams: QueryDatabaseParameters): Promise<QueryDatabaseResponse> {
		const response = await this.notion.databases.query(queryParams);
		return response;
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

	async getDatabase(databaseId: string): Promise<GetDatabaseResponse> {
		const pageResult = await this.notion.databases.retrieve({ database_id: databaseId });
		const result = pageResult;
		return result;
	}

	async createPage(page: CreatePageParameters): Promise<CreatePageResponse> {
		const createdPageResponse = await this.notion.pages.create(page);
		const result = createdPageResponse;
		return result;
	}

	async createStudentIdPage(studentId: string) {
		const FUNC_TAG = '.[createStudentIdPage]';
		const searchStudentIdPageRes = await this.searchPage(studentId);

		// TODO: Insted of pick the first element, check for the element that matches perfectly the searchTerm
		// const existingStudentIdPage = searchStudentIdPageRes.results[0];
		console.warn('createStudentIdPage');
		console.warn(JSON.stringify(searchStudentIdPageRes));
		const existingStudentIdPage = searchStudentIdPageRes.results.find((page) => {
			if (page.object === 'page' && 'properties' in page && 'title' in page.properties.title) {
				if (page.properties.title.type === 'title' && page.properties.title.title.length) {
					if (page.properties.title.title[0].type === 'text') {
						Logging.setup(studentId);
						return page.properties.title.title[0].text.content === studentId;
					}
				}
			}
		});
		if (existingStudentIdPage) {
			/** This code deletes the code of a existing page, which takes a lot of time (3 mins per page/100 blocks) */
			const blocksToRemove = await this.notion.blocks.children.list({
				block_id: existingStudentIdPage.id,
				page_size: CONFIG.ROADMAP_TEMPLATE.OVERRIDE_BLOCKS,
			});
			Logging.warning(
				`${FILE_TAG}${FUNC_TAG} Student Id Page '${studentId}' exists already (${existingStudentIdPage.id}), removing ${blocksToRemove.results.length} blocks...`,
			);
			for (const block of blocksToRemove.results) {
				await this.notion.blocks.delete({ block_id: block.id });
			}

			return existingStudentIdPage.id;
		}
		const studentCollectionName = CONFIG.ROADMAP_TEMPLATE.STUDENTS_COLLECTION_PAGE_NAME;
		const studentCollectionPageRes = await this.searchPage(studentCollectionName);

		const existingStudentCollectionPage = studentCollectionPageRes.results[0];
		if (!existingStudentCollectionPage) {
			throw new Error(`${FILE_TAG}${FUNC_TAG} No student collections found by name ${studentCollectionName}`);
		}

		const studentIdPageBody: CreatePageParameters = {
			parent: { page_id: existingStudentCollectionPage.id, type: 'page_id' },
			icon: {
				emoji: '👤',
			},
			properties: {
				title: {
					title: [
						{
							text: {
								content: studentId,
							},
						},
					],
				},
			},
		};

		const newStudentIdPage = await this.createPage(studentIdPageBody);
		return newStudentIdPage.id;
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

	async createStudentRoadmap(studentName: string, pageBody: CreatePageParameters): Promise<string> {
		const FUNC_TAG = '.[createStudentRoadmap]';
		const searchResult = await this.searchPage(studentName);

		const existingPage = searchResult.results[0];

		if (existingPage) {
			/** This code deletes the code of a existing page, which takes a lot of time (3 mins per page/100 blocks) */
			// const blocksToRemove = await this.notion.blocks.children.list({
			// 	block_id: existingPage.id,
			// 	page_size: CONFIG.ROADMAP_TEMPLATE.OVERRIDE_BLOCKS,
			// });
			// Logging.warning(
			// 	`Page '${studentName}' exists already (${existingPage.id}), removing ${blocksToRemove.results.length} blocks...`,
			// );
			// for (const block of blocksToRemove.results) {
			// 	await this.notion.blocks.delete({ block_id: block.id });
			// }

			// return existingPage.id;
			Logging.warning(`${FILE_TAG}${FUNC_TAG} Page '${studentName}' exists already (${existingPage.id}), archiving it...`);
			const archiveRes = await this.archivePage(existingPage.id);
			Logging.warning(`${FILE_TAG}${FUNC_TAG} ${archiveRes.id}`);
		}

		Logging.info(`${FILE_TAG}${FUNC_TAG} Page '${studentName}' does not exist yet, creating it...`);

		const pageCreationResponse = await this.createPage(pageBody);
		return pageCreationResponse.id;
	}
}
