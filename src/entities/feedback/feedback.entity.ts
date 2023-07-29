// Constants
import { DEFAULT_FEEDBACK_MSG } from '../../constants/feedback';

// Custom library
import Logging from '../../library/Logging';

import { IFeedbackRange } from './feedback.interface';

const FILE_TAG = '[FeedbackRange]';

export class FeedbackRange implements IFeedbackRange {
	range: { min: number; max: number };
	message: string;

	// Default values object
	private defaults = {
		range: { min: 0, max: 100 },
		message: DEFAULT_FEEDBACK_MSG.IMPROVEMENT_STRATEGY,
	};

	constructor(feedbackRangeData: any) {
		/** Validate and set the range
		 *  (checks all the possible options so it will be able to accept
		 *  user input data from sources like notion in the future)*/
		if ('range' in feedbackRangeData && feedbackRangeData.range) {
			let { min, max } = feedbackRangeData.range;
			min = Math.max(0, min);
			max = Math.min(100, max);
			if (min > max) {
				[min, max] = [max, min];
			}
			this.range = { min, max };
		} else {
			Logging.warning(
				`${FILE_TAG} feedback range is missing or invalid :${feedbackRangeData.range}, it'll be set to default range : 0 to 100.`,
			);
			this.range = this.defaults.range; // Use default range
		}

		// Validate feddback message
		if ('message' in feedbackRangeData && feedbackRangeData.message) {
			// If special_comment is missing, use the default value
			this.message = feedbackRangeData.message;
		} else {
			// Use default feedback if feedback is missing or invalid
			Logging.warning(
				`${FILE_TAG} feedback message is missing or invalid :${feedbackRangeData.feedback}, message will be set to default.`,
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
