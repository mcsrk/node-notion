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
import { RichTextConstructor } from '../entities/rich-text/rich.text';
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

		const headerCols: RichTextConstructor[][] = [
			[{ content: 'Goal', bold: true, color: 'blue' }],
			[{ content: 'Week', bold: true, color: 'blue' }],
			[{ content: 'Resources', bold: true, color: 'blue' }],
			[
				{
					content: 'Suggestions',
					bold: true,
					color: 'blue',
				},
			],
		];
		const dummyDataRow: RichTextConstructor[][] = [
			[
				{ content: 'Reading Comprehension Skills', bold: true },
				{ content: 'Algebra ', bold: true },
				{ content: 'Fraction Skills ', bold: true },
			],
			[{ content: '1', bold: true }],
			[
				{ content: 'Comparative Text Analysis', bold: true },
				{ content: 'Logic Games', bold: true },
			],
			[
				{
					content:
						'Analyze and compare 2-3 different texts daily, identifying similarities and differences in themes, characters, and settings.',
					bold: true,
				},
				{
					content: '\n- Solve 10-15 logic games and puzzles to enhance critical thinking skills.',
					bold: true,
				},
			],
		];

		const customTable = new Table(tempalteId, headerCols);
		customTable.addRow(dummyDataRow);

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
