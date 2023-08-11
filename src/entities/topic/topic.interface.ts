import { IFeedbackRange } from '../feedback/feedback.interface';

/** Params to list own products*/
export interface ITopicsOrSkills {
	name: string;
	performance: number;
	feedback: IFeedbackRange; // Improve strategies
}
