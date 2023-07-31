import { Request, Response } from 'express';

// Repositories
import { getNotionDBFeedbackRaw } from '../repositories/feedback.repository';

// Infrastructure
import NotionInstance from '../infrastructure/notion';

// Custom Libraries
import Logging from '../library/Logging';

import { Table } from '../entities/table/table.entity';

// Constants
import { DEFAULT_TABLE_HEADER, DEFAULT_TABLE_ROWS } from '../mocks/study_plan_table';
const FILE_TAG = '[Debug controller]';

const notionDbViewFeedbackRow = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[notionDbViewFeedbackRow]';
	Logging.info(`${FILE_TAG}${FUNC_TAG} INIT`);
	try {
		const { name, performance } = req.body;

		const feedbackDBQueryResults = await getNotionDBFeedbackRaw(name, performance);

		let returns = {
			feedbackRow: feedbackDBQueryResults,
		};
		Logging.info(`${FILE_TAG}${FUNC_TAG} Returning`);
		return res.status(200).json(returns);
	} catch (error) {
		Logging.error((error as Error).message);
		Logging.error(error);

		res.status(500).json({
			message: `Error retrieving feedback results`,
			error: (error as Error).message,
		});
	}
};

const createTableInTestPage = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createTableInTestPage]';
	Logging.info(`${FILE_TAG}${FUNC_TAG} Function started!`);
	try {
		const { template } = req.query;

		if (!template || typeof template !== 'string') {
			return res.status(404).json({ message: `Query field template must be a string` });
		}

		const searchTemplate = await NotionInstance.searchPage(template);

		if (searchTemplate.results.length === 0) {
			return res.status(404).json({ message: `Template page: '${template}' not found in Notion workspace` });
		}

		const tempalteId = searchTemplate.results[0].id;
		const templatePage = await NotionInstance.getPage(tempalteId);
		const templatePageChildren = await NotionInstance.getPageBlockChildren(tempalteId);

		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Goal',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Week',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Resources',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Suggestions',
		// 			},
		// 		},
		// 	],
		// ];
		// const bodyRow: RichTextItemRequest[][] = [
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Row 1 - Cell 1',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Row 1 - Cell 2',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Row 1 - Cell 3',
		// 			},
		// 		},
		// 	],
		// 	[
		// 		{
		// 			type: 'text',
		// 			text: {
		// 				content: 'Row 1 - Cell 4',
		// 			},
		// 		},
		// 	],
		// ];
		const headerCols = DEFAULT_TABLE_HEADER;

		const customTable = new Table(tempalteId, headerCols, 9);
		DEFAULT_TABLE_ROWS.map((row) => customTable.addRow(row));

		await NotionInstance.appendChildren(customTable.generateTableRequestBody());
		let returns = {
			templatePage,
			templatePageChildren,
		};
		Logging.info(`${FILE_TAG}${FUNC_TAG} Returning`);
		return res.status(200).json(returns);
	} catch (error) {
		Logging.error((error as Error).message);
		Logging.error(error);

		res.status(500).json({
			message: `Error retrieving original template`,
			error: (error as Error).message,
		});
	}
};

export { notionDbViewFeedbackRow, createTableInTestPage };
