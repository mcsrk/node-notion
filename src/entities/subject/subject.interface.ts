import { IFeedbackRange } from '../feedback/feedback.interface';
import { ITopicsOrSkills } from '../topic/topic.interface';

export interface ISubject {
	name: string;
	performance: number;
	topicsOfDifficulty: ITopicsOrSkills[];
	skillsOfDifficulty: ITopicsOrSkills[];
	feedback: IFeedbackRange;
}
