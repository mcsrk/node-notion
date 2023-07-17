import { FeedbackRange } from '../entities/feedback/feedback.entity';

// Custom library
import Logging from '../library/Logging';

// Mock up
import { createGenericSubjectFeedbackRanges } from '../mocks/feedback_ranges';

const FILE_TAG = '[FeedbackRepo]';

/** TODO: This async function would fetch feedback messages from an external
 *  data source, like notion database o general porpuse database */

// const getExternalFeedbackBySubject = await (subjectName: string):Promise<IFeedbackRange[]> => {};

const getFeedbackBySubjectAndPerformance = (subjectName: string, subjectPerf: number): FeedbackRange => {
	const FUNC_TAG = '.[getFeedbackBySubject]';
	const DATA_SOURCE = 'MOCK UP DATA';
	try {
		Logging.info(`${FILE_TAG}${FUNC_TAG} Function started! -----------------`);
		Logging.info(`${FILE_TAG}${FUNC_TAG} Retrieving feedback for: ${subjectName}`);

		/** Get all feedback ranges from source*/
		const mockedUpFeedback = createGenericSubjectFeedbackRanges(subjectName);

		Logging.info(
			`${FILE_TAG}${FUNC_TAG} Retrieved: ${mockedUpFeedback.length} ${subjectName} feedback ranges from: ${DATA_SOURCE}`,
		);

		const adaptedfeedback = mockedUpFeedback.map((feedback) => new FeedbackRange(feedback));

		/** Get only the range that applies to the student performance */
		const actualFeedback = adaptedfeedback.find(
			(everyfeedback) => everyfeedback.range.min <= subjectPerf && everyfeedback.range.max >= subjectPerf,
		);

		Logging.info(
			`${FILE_TAG}${FUNC_TAG} Feedback that matched student's score ${subjectPerf} is : ${JSON.stringify(
				actualFeedback?.range,
			)}.`,
		);

		/** If there is no feedback range that includes student performance, return the generic default feedback */
		return actualFeedback ?? new FeedbackRange({});
	} catch (error) {
		throw new Error(`${FILE_TAG}${FUNC_TAG} Error retriving FeedbackRanges objects: ${error}`);
	}
};

export { getFeedbackBySubjectAndPerformance };
