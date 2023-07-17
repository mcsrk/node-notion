import { IFeedbackRange } from './feedback.interface';

const TAG = '[FeedbackRange]';

export class FeedbackRange implements IFeedbackRange {
	range: { min: number; max: number };
	feedback: { special_comment: string; strategies: { message: string }[] };

	// Default values object
	private defaults = {
		range: { min: 0, max: 100 },
		feedback: {
			special_comment: 'No special comments defined yet',
			strategies: new Array(4).fill({ message: 'No strategies defined yet' }),
		},
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
			console.log(`${TAG} feedback range is missing or invalid, it'll be set to default range : 0 to 100.`);
			this.range = this.defaults.range; // Use default range
		}

		// Validate and set the feedback messages
		if ('feedback' in feedbackRangeData && feedbackRangeData.feedback) {
			const { special_comment, strategies } = feedbackRangeData.feedback;

			// If special_comment is missing, use the default value
			this.feedback = {
				special_comment: special_comment || this.defaults.feedback.special_comment,
				strategies: [],
			};

			// If strategies are provided, use them, otherwise, use default strategies
			if (Array.isArray(strategies)) {
				this.feedback.strategies = strategies.slice(0, 4).map((strategy) => ({
					message: strategy.message || this.defaults.feedback.strategies[0].message,
				}));
				// Fill remaining strategies with default values if less than 4
				while (this.feedback.strategies.length < 4) {
					this.feedback.strategies.push({ message: this.defaults.feedback.strategies[0].message });
				}
			} else {
				// Use default strategies if strategies are not provided
				this.feedback.strategies = this.defaults.feedback.strategies;
			}
		} else {
			// Use default feedback if feedback is missing or invalid
			console.log(`${TAG} feedback data is missing or invalid, it'll be set to default feedback.`);
			this.feedback = this.defaults.feedback;
		}
	}
}
