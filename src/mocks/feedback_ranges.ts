import { IFeedbackRange } from '../entities/feedback/feedback.interface';

/** This feedback should be retrieved from a Notion database or general porpuse database */
export const createGenericSubjectFeedbackRanges = (subjectName: string): IFeedbackRange[] => {
	const subjectCaps = subjectName.toUpperCase();
	return [
		{
			range: { min: 0, max: 0.19 },
			feedback: {
				special_comment: `Good effort in ${subjectCaps}!`,
				strategies: [
					{ message: `Try practicing more ${subjectCaps} exercises.` },
					{ message: `Review the basic ${subjectCaps} concepts.` },
				],
			},
		},
		{
			range: { min: 0.2, max: 0.39 },
			feedback: {
				special_comment: `Making progress in ${subjectCaps}!`,
				strategies: [
					{ message: `Focus on ${subjectCaps} problem-solving techniques.` },
					{ message: `Seek additional ${subjectCaps} help if needed.` },
				],
			},
		},
		{
			range: { min: 0.4, max: 0.59 },
			feedback: {
				special_comment: `Doing well in ${subjectCaps}!`,
				strategies: [
					{ message: `Continue practicing ${subjectCaps} regularly.` },
					{ message: `Explore advanced ${subjectCaps} topics.` },
				],
			},
		},
		{
			range: { min: 0.6, max: 0.79 },
			feedback: {
				special_comment: `Great job in ${subjectCaps}!`,
				strategies: [
					{ message: `Work on challenging ${subjectCaps} problems.` },
					{ message: `Participate in ${subjectCaps} discussions.` },
				],
			},
		},
		{
			range: { min: 0.8, max: 1 },
			feedback: {
				special_comment: `Excellent performance in ${subjectCaps}!`,
				strategies: [
					{ message: `Share ${subjectCaps} knowledge with peers.` },
					{ message: `Take up more complex ${subjectCaps} tasks.` },
				],
			},
		},
	];
};
