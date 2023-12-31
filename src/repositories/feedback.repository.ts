import { QueryDatabaseResponse, UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { FeedbackRange } from '../entities/feedback/feedback.entity';
import NotionInstance from '../infrastructure/notion';
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
// Custom library
import Logging from '../library/Logging';
// Mock up
import { mockSkillOrTopicStrategies } from '../mocks/feedback_ranges';
import { RichTextItem } from '../entities/rich-text/rich.text';

const FILE_TAG = '[FeedbackRepo]';

const insertFeedbackRow = async (
	feedbackDatabaseId: string,

	isSubtopic: boolean,
	topicName: string,
	min: number,
	max: number,
) => {
	Logging.info(`[insertingFeedbackRow] ${isSubtopic} ${topicName} ${min} ${max}]`);
	const pageRowBody: CreatePageParameters = {
		parent: {
			database_id: feedbackDatabaseId,
		},
		properties: {
			is_subtopic: {
				checkbox: isSubtopic,
			},
			subject_name: {
				title: [
					{
						text: {
							content: topicName,
						},
					},
				],
			},
			min: {
				number: min,
			},
			max: {
				number: max,
			},
		},
	};
	return await NotionInstance.createPage(pageRowBody);
};

const notionFeedbackAdapter = (notionEntry: any): { [key: string]: number | string | object | null } => {
	// Logging.warning('Notion ROW');
	// Logging.warning(JSON.stringify(notionEntry));
	let adaptedEntry: { [key: string]: number | string | object | null } = {
		subjectName: null,
		min: null,
		max: null,
		message: null,
		study_resource: { name: null, href: null },
		suggestions: null,
	};

	if (notionEntry.subject_name.title[0].plain_text) {
		adaptedEntry['subjectName'] = notionEntry.subject_name.title[0].plain_text;
	}
	if (notionEntry.min.number) {
		adaptedEntry['min'] = notionEntry.min.number;
	}
	if (notionEntry.max.number) {
		adaptedEntry['max'] = notionEntry.max.number;
	}
	if (notionEntry.message.rich_text[0].plain_text) {
		adaptedEntry['message'] = notionEntry.message.rich_text[0].plain_text;
	}
	let resource = null;
	if (notionEntry.study_resource.rich_text.length && 'plain_text' in notionEntry.study_resource.rich_text[0]) {
		resource = {
			name: notionEntry.study_resource.rich_text[0].plain_text,
			href: notionEntry.study_resource.rich_text[0].href,
		};
	}
	adaptedEntry['study_resource'] = resource;
	if (notionEntry.default_suggestion.rich_text.length && notionEntry.default_suggestion.rich_text[0].plain_text) {
		adaptedEntry['default_suggestion'] = notionEntry.default_suggestion.rich_text[0].plain_text;
	}
	return adaptedEntry;
};

type UpdateNotionFeedbackParams = {
	message: string;
	defaultSuggestion: string;
};
const updateNotionFeedbackRow = async (page_id: string, updateParams: UpdateNotionFeedbackParams) => {
	const default_suggestion = new RichTextItem({ content: updateParams.defaultSuggestion });
	const message = new RichTextItem({ content: updateParams.message });

	const feedbackRowUpdate: UpdatePageParameters = {
		page_id,
		properties: {
			default_suggestion: {
				rich_text: [default_suggestion],
			},
			message: {
				rich_text: [message],
			},
		},
	};

	return NotionInstance.updatePage(feedbackRowUpdate);
};

const getExternalFeedbackByPerformance = async (
	topicName: string,
	topicPerformance: number,
): Promise<FeedbackRange> => {
	const FUNC_TAG = '.[getFeedbackBySubject]';
	const DATA_SOURCE = 'NOTION-DB';
	try {
		const feedbackDBName = 'Feedback';
		/** Get all feedback ranges from source*/
		const feedbackDatabaseMeta = await NotionInstance.searchDatabase(feedbackDBName);
		if (!feedbackDatabaseMeta.results[0]) {
			throw new Error(`No database found by searchTerm: ${feedbackDBName}`);
		}
		const feedbackDatabaseID = feedbackDatabaseMeta.results[0].id;
		// TODO: Make this query useful after converting the repository into a class or removed it
		const feedbackDatabase = await NotionInstance.getDatabase(feedbackDatabaseID);
		const feedbackResults = await NotionInstance.queryDatabase({
			database_id: feedbackDatabaseID,
			filter: {
				and: [
					{
						property: 'subject_name',
						rich_text: {
							equals: topicName,
						},
					},
					{
						property: 'max',
						number: {
							greater_than_or_equal_to: topicPerformance,
						},
					},
					{
						property: 'min',
						number: {
							less_than_or_equal_to: topicPerformance,
						},
					},
				],
			},
		});

		if (!feedbackResults.results[0]) {
			Logging.warning(`No feedback found for (${topicName} - ${topicPerformance})`);
			Logging.warning(feedbackResults);
			/** If there is no feedback range that includes student performance, return the generic default feedback */
			return new FeedbackRange({});
		}
		const selectedFeedback = feedbackResults.results[0];
		if (!('properties' in selectedFeedback)) {
			throw new Error(`${FILE_TAG}${FUNC_TAG} No properties found in Feedback DB Queried Row`);
		}

		const adapted = notionFeedbackAdapter(selectedFeedback.properties);
		Logging.info(
			`${FILE_TAG}${FUNC_TAG} ${DATA_SOURCE} Feedback retrieved (${topicName} ${topicPerformance}): [${adapted.min} - ${adapted.max}] => ${adapted.message}`,
		);

		const feedback = new FeedbackRange(adapted);

		return feedback;
	} catch (error) {
		throw new Error(`${FILE_TAG}${FUNC_TAG} Error retriving FeedbackRanges objects: ${error}`);
	}
};

const getNotionDBFeedbackRaw = async (topicName: string, topicPerformance: number): Promise<QueryDatabaseResponse> => {
	const FUNC_TAG = '.[getFeedbackBySubject]';

	try {
		const feedbackDBName = 'Feedback';
		/** Get all feedback ranges from source*/
		const feedbackDatabaseMeta = await NotionInstance.searchDatabase(feedbackDBName);
		if (!feedbackDatabaseMeta.results[0]) {
			throw new Error(`No database found by searchTerm: ${feedbackDBName}`);
		}
		const feedbackDatabaseID = feedbackDatabaseMeta.results[0].id;
		const feedbackResults = await NotionInstance.queryDatabase({
			database_id: feedbackDatabaseID,
			filter: {
				and: [
					{
						property: 'subject_name',
						rich_text: {
							equals: topicName,
						},
					},
					{
						property: 'max',
						number: {
							greater_than_or_equal_to: topicPerformance,
						},
					},
					{
						property: 'min',
						number: {
							less_than_or_equal_to: topicPerformance,
						},
					},
				],
			},
		});

		const selectedFeedback = feedbackResults.results[0];
		if (!('properties' in selectedFeedback)) {
			throw new Error(`${FILE_TAG}${FUNC_TAG} No properties found in Feedback DB Queried Row`);
		}

		return feedbackResults;
	} catch (error) {
		throw new Error(`${FILE_TAG}${FUNC_TAG} Error retriving FeedbackRanges objects: ${error}`);
	}
};

/** Dummy Mocked */
const getFeedbackBySkillOrTopicPerformance = (skillOrTopicName: string, skillOrTopicPerf: number): FeedbackRange => {
	const FUNC_TAG = '.[getFeedbackBySkillOrTopic]';
	const DATA_SOURCE = 'MOCK UP DATA';
	try {
		Logging.info(`${FILE_TAG}${FUNC_TAG} Function started! -----------------`);
		Logging.info(`${FILE_TAG}${FUNC_TAG} Retrieving feedback for: ${skillOrTopicName}`);

		/** Get all feedback ranges from source*/
		const mockedUpFeedback = mockSkillOrTopicStrategies(skillOrTopicName);

		Logging.info(
			`${FILE_TAG}${FUNC_TAG} Retrieved: ${mockedUpFeedback.length} ${skillOrTopicName} feedback ranges from: ${DATA_SOURCE}`,
		);

		const adaptedfeedback = mockedUpFeedback.map((feedback) => new FeedbackRange(feedback));

		/** Get only the range that applies to the student performance */
		const actualFeedback = adaptedfeedback.find(
			(everyfeedback) => everyfeedback.min <= skillOrTopicPerf && everyfeedback.max >= skillOrTopicPerf,
		);

		Logging.info(
			`${FILE_TAG}${FUNC_TAG} Feedback that matched score in Skill Or Topic ${skillOrTopicPerf} is : ${JSON.stringify(
				actualFeedback,
			)}.`,
		);

		/** If there is no feedback range that includes student performance, return the generic default feedback */
		return actualFeedback ?? new FeedbackRange({});
	} catch (error) {
		throw new Error(`${FILE_TAG}${FUNC_TAG} Error retriving FeedbackRanges objects: ${error}`);
	}
};

export {
	getFeedbackBySkillOrTopicPerformance,
	getExternalFeedbackByPerformance,
	getNotionDBFeedbackRaw,
	insertFeedbackRow,
	updateNotionFeedbackRow,
};
