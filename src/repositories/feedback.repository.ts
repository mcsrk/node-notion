import { FeedbackRange } from '../entities/feedback/feedback.entity';
import { createGenericSubjectFeedbackRanges } from '../mocks/feedback_ranges';

const FILE_TAG = '[Feedback repository]';

/** TODO: This async function would fetch feedback messages from an external
 *  data source, like notion database o general porpuse database */

// const getExternalFeedbackBySubject = await (subjectName: string):Promise<IFeedbackRange[]> => {};

const getFeedbackBySubjectAndPerformance = (subjectName: string, subjectPerf: number): FeedbackRange => {
	const FUNC_TAG = '.[getFeedbackBySubject]';
	const DATA_SOURCE = 'MOCK UP DATA';
	try {
		console.info(FILE_TAG + FUNC_TAG, 'Function started!');
		console.info(FILE_TAG + FUNC_TAG, `Mocking up feedback data for subject: ${subjectName}!`);

		/** Get all feedback ranges from source*/
		const mockedUpFeedback = createGenericSubjectFeedbackRanges(subjectName);

		console.info(
			FILE_TAG + FUNC_TAG,
			`Mocked up: ${mockedUpFeedback.length} ${subjectName} feedback ranges from: ${DATA_SOURCE}!`,
		);
		console.info(FILE_TAG + FUNC_TAG, 'Adapting external feedback data as FeedbackRanges objects...');

		const adaptedfeedback = mockedUpFeedback.map((feedback) => new FeedbackRange(feedback));

		console.info(FILE_TAG + FUNC_TAG, `Adapted ${adaptedfeedback.length} FeedbackRanges objects.`);

		/** Get only the range that applies to the student performance */
		const actualFeedback = adaptedfeedback.find(
			(everyfeedback) => everyfeedback.range.min <= subjectPerf && everyfeedback.range.max >= subjectPerf,
		);

		console.info(
			FILE_TAG + FUNC_TAG,
			`Feedback that matched the student score ${subjectPerf} is : ${JSON.stringify(actualFeedback?.range)}.`,
		);
		console.info(FILE_TAG + FUNC_TAG, `Returning actual subject FeedbackRanges.`);

		/** If there is no feedback range that includes student performance, return the generic default feedback */
		return actualFeedback ?? new FeedbackRange({});
	} catch (error) {
		throw new Error(`${FILE_TAG} ${FUNC_TAG} Error retriving FeedbackRanges objects: ${error}`);
	}
};

export { getFeedbackBySubjectAndPerformance };
