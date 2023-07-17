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

import { CONFIG } from '../../config/config';

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

	async createStudentIdPage(studentId: string) {
		const searchStudentIdPageRes = await this.searchPage(studentId);

		const existingStudentIdPage = searchStudentIdPageRes.results[0];
		if (existingStudentIdPage) {
			/** This code deletes the code of a existing page, which takes a lot of time (3 mins per page/100 blocks) */
			const blocksToRemove = await this.notion.blocks.children.list({
				block_id: existingStudentIdPage.id,
				page_size: CONFIG.ROADMAP_TEMPLATE.OVERRIDE_BLOCKS,
			});
			console.log(
				`Student Id Page '${studentId}' exists already (${existingStudentIdPage.id}), removing ${blocksToRemove.results.length} blocks...`,
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
			throw new Error(`No student collections found by name ${studentCollectionName}`);
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
		const searchResult = await this.searchPage(studentName);

		const existingPage = searchResult.results[0];

		if (existingPage) {
			/** This code deletes the code of a existing page, which takes a lot of time (3 mins per page/100 blocks) */
			// const blocksToRemove = await this.notion.blocks.children.list({
			// 	block_id: existingPage.id,
			// 	page_size: CONFIG.ROADMAP_TEMPLATE.OVERRIDE_BLOCKS,
			// });
			// console.log(
			// 	`Page '${studentName}' exists already (${existingPage.id}), removing ${blocksToRemove.results.length} blocks...`,
			// );
			// for (const block of blocksToRemove.results) {
			// 	await this.notion.blocks.delete({ block_id: block.id });
			// }

			// return existingPage.id;
			console.log(`Page '${studentName}' exists already (${existingPage.id}), archiving it...`);
			const archiveRes = await this.archivePage(existingPage.id);
			console.log(archiveRes);
		}

		console.log(`Page '${studentName}'' does not exist yet, creating it...`);

		const pageCreationResponse = await this.createPage(pageBody);
		return pageCreationResponse.id;
	}
}
