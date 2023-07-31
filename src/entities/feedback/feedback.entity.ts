// Constants
import { DEFAULT_FEEDBACK } from '../../constants/feedback';

// Custom library
import Logging from '../../library/Logging';

import { IFeedbackRange } from './feedback.interface';

const FILE_TAG = '[FeedbackRange]';

export class FeedbackRange implements IFeedbackRange {
	min: number;
	max: number;
	message: string;
	suggestions: string;
	study_resource: { name: string; href: string | null };

	constructor(feedbackData: any) {
		/** Validate and set the range
		 *  (checks all the possible options so it will be able to accept
		 *  user input data from sources like notion in the future)*/
		if ('min' in feedbackData && 'max' in feedbackData) {
			let min = Math.max(0, feedbackData.min);
			let max = Math.min(100, feedbackData.max);
			if (min > max) {
				[min, max] = [max, min];
			}
			this.min = min;
			this.max = max;
		} else {
			// Logging.warning(`${FILE_TAG} feedback range is missing or invalid, it'll be set to the default range: 0 to 100.`);
			this.min = DEFAULT_FEEDBACK.MIN;
			this.max = DEFAULT_FEEDBACK.MAX;
		}

		// Validate feedback message
		if ('message' in feedbackData && feedbackData.message) {
			this.message = feedbackData.message;
		} else {
			// Logging.warning(`${FILE_TAG} feedback message is missing or invalid, it'll be set to default.`);
			this.message = DEFAULT_FEEDBACK.MESSAGE;
		}
		// Validate feedback study resource
		if ('study_resource' in feedbackData && feedbackData.study_resource) {
			this.study_resource = feedbackData.study_resource;
		} else {
			this.study_resource = DEFAULT_FEEDBACK.STUDY_RESOURCE;
		}
		// Validate feedback suggestion
		if ('suggestions' in feedbackData && feedbackData.suggestions) {
			this.suggestions = feedbackData.suggestions;
		} else {
			this.suggestions = DEFAULT_FEEDBACK.SUGGESTIONS;
		}
	}

	exportFeedbackMessageForNotion(feedbackNotionVariableName: string): { [key: string]: string } {
		const exportSubject: { [key: string]: string } = {};

		exportSubject[feedbackNotionVariableName] = this.message;

		return exportSubject;
	}
}
