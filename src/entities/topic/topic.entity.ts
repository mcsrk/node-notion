// Custom library
import Logging from '../../library/Logging';

// Repository
import { getExternalFeedbackByPerformance } from '../../repositories/feedback.repository';

// Entities
import { FeedbackRange } from '../feedback/feedback.entity';

// Interfaces
import { ITopicsOrSkills } from './topic.interface';

const TAG = '[TopicOrSkill]';

export class TopicOrSkill implements ITopicsOrSkills {
	name: string;
	performance: number;
	feedback: FeedbackRange = new FeedbackRange({});

	constructor(topicOrSkillData: any) {
		/** Validation: is name valid? otherwise let it as N/A*/
		if (!('name' in topicOrSkillData) || topicOrSkillData.name === '') {
			Logging.warning(`${TAG} name has a invalid value: ${topicOrSkillData.name}, it'll be ignored and set to N/A.`);
			this.name = 'N/A';
		} else {
			this.name = topicOrSkillData.name;
		}

		/** Validation: is performance a valid number or can be parsed into a valid number?
		 * otherwise let it as 0. */
		if (
			!('performance' in topicOrSkillData) ||
			isNaN(topicOrSkillData.performance) ||
			isNaN(Number(topicOrSkillData.performance))
		) {
			Logging.warning(`${TAG} performance : ${topicOrSkillData.performance}, it'll be ignored and set to 0.`);
			this.performance = 0;
		} else {
			this.performance = topicOrSkillData.performance;
		}
	}

	/** Get subject's feedback based on performance */
	async setSubtopicFeedback(): Promise<void> {
		const subjectFeedback = await getExternalFeedbackByPerformance(this.name, this.performance);
		this.feedback = subjectFeedback;
	}

	exportStrategyForNotion(strategyVariableName: string): { [key: string]: string } {
		const exportedStrategy = this.feedback.exportFeedbackForNotion(strategyVariableName);
		return exportedStrategy;
	}
}
