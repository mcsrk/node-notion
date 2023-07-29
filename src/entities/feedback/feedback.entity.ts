// Constants
import { DEFAULT_FEEDBACK_MSG } from '../../constants/feedback';

// Custom library
import Logging from '../../library/Logging';

import { IFeedbackRange } from './feedback.interface';

const FILE_TAG = '[FeedbackRange]';

export class FeedbackRange implements IFeedbackRange {
	min: number;
	max: number;
	message: string;

	// Default values object
	private defaults = {
		min: 0,
		max: 100,
		message: DEFAULT_FEEDBACK_MSG.IMPROVEMENT_STRATEGY,
	};

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
			Logging.warning(`${FILE_TAG} feedback range is missing or invalid. It'll be set to the default range: 0 to 100.`);
			this.min = this.defaults.min; // Use default min
			this.max = this.defaults.max; // Use default max
		}

		// Validate feddback message
		if ('message' in feedbackData && feedbackData.message) {
			// If special_comment is missing, use the default value
			this.message = feedbackData.message;
		} else {
			// Use default feedback if feedback is missing or invalid
			Logging.warning(
				`${FILE_TAG} feedback message is missing or invalid :${feedbackData.feedback}, message will be set to default.`,
			);
			this.message = this.defaults.message;
		}
	}

	exportFeedbackForNotion(feedbackNotionVariableName: string): { [key: string]: string } {
		const exportSubject: { [key: string]: string } = {};

		exportSubject[feedbackNotionVariableName] = this.message;

		return exportSubject;
	}
}
