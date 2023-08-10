import { Request, Response } from 'express';
// Repositories
import { getNotionDBFeedbackRaw, insertFeedbackRow } from '../repositories/feedback.repository';

// Infrastructure
import NotionInstance from '../infrastructure/notion';

// Custom Libraries
import Logging from '../library/Logging';

import { Table } from '../entities/table/table.entity';

// Constants
import { DEFAULT_TABLE_HEADER, DEFAULT_TABLE_ROWS } from '../mocks/study_plan_table';
import { RichTextConstructor } from '../entities/rich-text/rich.text';
import { SYNAP_REDUCED_MOCKED_DATA } from '../mocks/reduced-synap-demo-data';
import { SYNAP_MOCKED_DATA } from '../mocks/synap-scholarly-pipeline-output';
import { CreatePageResponse } from '@notionhq/client/build/src/api-endpoints';

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

		const STUDY_PLAN_HEADER_COLS: RichTextConstructor[][] = [
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
		const dummyDataRow2: RichTextConstructor[][] = [
			[{ content: 'Another skill' }],
			[{ content: '2' }],
			[{ content: 'Another resource', bold: true, href: 'https://www.upwork.com' }],
			[{ content: 'Another suggestion' }],
		];

		const customTable = new Table(tempalteId, STUDY_PLAN_HEADER_COLS);
		customTable.addRow(dummyDataRow);
		customTable.addRow(dummyDataRow2);

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
type SynapMockData = {
	_id: string;
	facets: {
		id: string;
		facet: string;
		label: string;
		score: number;
		percentile: number;
	}[];
};

const synapDemoDataInspector = (req: Request, res: Response) => {
	try {
		// Do something with the parsed data
		Logging.info('Reading...');
		// const data: SynapMockData[] = SYNAP_REDUCED_MOCKED_DATA;
		const data: SynapMockData[] = SYNAP_MOCKED_DATA;
		const entriesLength = data.length;
		const groupedLabels = {
			skill: new Set<string>(),
			topic: new Set<string>(),
			subtopic: new Set<string>(),
			subject: new Set<string>(),
		};

		// Loop through the facets array and group the labels
		data.forEach((facetObj) => {
			facetObj.facets.forEach((_facet) => {
				const { facet, label } = _facet;
				if (facet === 'skill' || facet === 'topic' || facet === 'subtopic' || facet === 'subject') {
					groupedLabels[facet].add(label);
				}
			});
		});

		// Convert the Sets to arrays before sending the response
		const groupedLabelsArray = {
			all: Array.from(new Set<string>([...groupedLabels.skill, ...groupedLabels.topic, ...groupedLabels.subtopic])).sort(),
			skills: Array.from(groupedLabels.skill).sort(),
			topics: Array.from(groupedLabels.topic).sort(),
			subtopics: Array.from(groupedLabels.subtopic).sort(),
			subject: Array.from(groupedLabels.subject).sort(),
		};

		res.status(200).json({ entriesLength, individualSubjects: groupedLabelsArray });
	} catch (error) {
		Logging.error('Error reading beauty-sholarly-pipeline-output.json');
		Logging.error(error);
		res.status(500).json({
			message: `Error reading Synap Mocked data`,
			error: (error as Error).message,
		});
	}
};
const insertFeedbackEntiresAutomatically = async (req: Request, res: Response) => {
	try {
		// Do something with the parsed data
		Logging.info('Creating atuomatic feedback rows...');
		// const data: SynapMockData[] = SYNAP_REDUCED_MOCKED_DATA;
		const data: SynapMockData[] = SYNAP_MOCKED_DATA;
		const entriesLength = data.length;
		const groupedLabels = {
			skill: new Set<string>(),
			topic: new Set<string>(),
			subtopic: new Set<string>(),
			subject: new Set<string>(),
		};

		// Loop through the facets array and group the labels
		data.forEach((facetObj) => {
			facetObj.facets.forEach((_facet) => {
				const { facet, label } = _facet;
				if (facet === 'skill' || facet === 'topic' || facet === 'subtopic' || facet === 'subject') {
					groupedLabels[facet].add(label);
				}
			});
		});

		// Convert the Sets to arrays before sending the response
		const groupedLabelsArray = {
			all: Array.from(new Set<string>([...groupedLabels.skill, ...groupedLabels.topic, ...groupedLabels.subtopic])).sort(),
			skills: Array.from(groupedLabels.skill).sort(),
			topics: Array.from(groupedLabels.topic).sort(),
			subtopics: Array.from(groupedLabels.subtopic).sort(),
			subjects: Array.from(groupedLabels.subject).sort(),
		};

		let responses: CreatePageResponse[] = [];
		const FEEDBACK_RANGES = [
			{ min: 0, max: 0.19 },
			{ min: 0.2, max: 0.39 },
			{ min: 0.4, max: 0.59 },
			{ min: 0.6, max: 0.79 },
			{ min: 0.8, max: 1 },
		];

		const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

		const MAX_CONCURRENT_REQUESTS = 1;
		const REQUEST_DELAY_MS = 1000 / 1; // 1/3 seconds

		Logging.info(`Topics:  ${groupedLabelsArray.topics.length}  `);

		// Crete feedback entries for Topics
		for (const topic of groupedLabelsArray.topics) {
			Logging.info(`Creating ${FEEDBACK_RANGES.length} feedback rows for topic: ${topic}...`);
			const topicRowsPromises = [];

			for (const range of FEEDBACK_RANGES) {
				topicRowsPromises.push(
					insertFeedbackRow('76ac2bd0-871b-4495-8dbb-a9985b45c709', true, topic, range.min, range.max),
				);
				if (topicRowsPromises.length >= MAX_CONCURRENT_REQUESTS) {
					const reqResponse = await Promise.all(topicRowsPromises);
					responses = responses.concat(reqResponse);
					topicRowsPromises.length = 0; // Clear the array
					await sleep(REQUEST_DELAY_MS);
				}
			}

			if (topicRowsPromises.length > 0) {
				const reqResponse = await Promise.all(topicRowsPromises);
				responses = responses.concat(reqResponse);
			}

			Logging.info(`Created feedback rows for topic: ${topic}!`);
		}

		for (const subject of groupedLabelsArray.subjects) {
			Logging.info(`Creating ${FEEDBACK_RANGES.length} feedback rows for subject: ${subject}...`);
			const topicRowsPromises = [];

			for (const range of FEEDBACK_RANGES) {
				topicRowsPromises.push(
					insertFeedbackRow('76ac2bd0-871b-4495-8dbb-a9985b45c709', false, subject, range.min, range.max),
				);
				if (topicRowsPromises.length >= MAX_CONCURRENT_REQUESTS) {
					const reqResponse = await Promise.all(topicRowsPromises);
					responses = responses.concat(reqResponse);
					topicRowsPromises.length = 0; // Clear the array
					await sleep(REQUEST_DELAY_MS);
				}
			}

			if (topicRowsPromises.length > 0) {
				const reqResponse = await Promise.all(topicRowsPromises);
				responses = responses.concat(reqResponse);
			}

			Logging.info(`Created feedback rows for subject: ${subject}!`);
		}

		res.status(200).json({ entriesLength, individualSubjects: groupedLabelsArray, responses });
	} catch (error) {
		Logging.error('Error reading beauty-sholarly-pipeline-output.json');
		Logging.error(JSON.stringify(error));
		res.status(500).json({
			message: `Error reading Synap Mocked data`,
			error: (error as Error).message,
		});
	}
};

export { notionDbViewFeedbackRow, createTableInTestPage, synapDemoDataInspector, insertFeedbackEntiresAutomatically };
