// Custom library
import Logging from '../../library/Logging';
import { ITopicsOrSkills } from './topic.interface';

const TAG = '[TopicOrSkill]';

export class TopicOrSkill implements ITopicsOrSkills {
	name: string;
	performance: number;

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
}
