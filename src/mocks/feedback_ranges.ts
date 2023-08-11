import { IFeedbackRange } from '../entities/feedback/feedback.interface';

/** This feedback should be retrieved from a Notion database or general porpuse database */
export const mockSpecialCommentsSubjectFeedback = (subjectName: string): IFeedbackRange[] => {
	const subjectCaps = subjectName.toUpperCase();
	return [
		{
			min: 0,
			max: 0.19,
			message: `Good effort in ${subjectCaps}!`,
			study_resource: { name: `${subjectCaps} mocked study resource`, href: null },
			suggestions: `${subjectCaps} suggestion`,
		},
		{
			min: 0.2,
			max: 0.39,
			message: `Making progress in ${subjectCaps}!`,
			study_resource: { name: `${subjectCaps} mocked study resource`, href: null },
			suggestions: `${subjectCaps} suggestion`,
		},
		{
			min: 0.4,
			max: 0.59,
			message: `Doing well in ${subjectCaps}!`,
			study_resource: { name: `${subjectCaps} mocked study resource`, href: null },
			suggestions: `${subjectCaps} suggestion`,
		},
		{
			min: 0.6,
			max: 0.79,
			message: `Great job in ${subjectCaps}!`,
			study_resource: { name: `${subjectCaps} mocked study resource`, href: null },
			suggestions: `${subjectCaps} suggestion`,
		},
		{
			min: 0.8,
			max: 1,
			message: `Excellent performance in ${subjectCaps}!`,
			study_resource: { name: `${subjectCaps} mocked study resource`, href: null },
			suggestions: `${subjectCaps} suggestion`,
		},
	];
};

/** This feedback should be retrieved from a Notion database or general porpuse database */
export const mockSkillOrTopicStrategies = (skillOrTopicName: string): IFeedbackRange[] => {
	const skillOrTopic = skillOrTopicName.toUpperCase();
	return [
		{
			min: 0,
			max: 0.19,
			message: `🔴Try practicing more ${skillOrTopic} exercises.`,
			//message: `Review the basic ${subjectCaps} concepts.`,
			study_resource: { name: `${skillOrTopic} mocked study resource`, href: null },
			suggestions: `${skillOrTopic} suggestion`,
		},
		{
			min: 0.2,
			max: 0.39,
			message: `🟠Focus on ${skillOrTopic} problem-solving techniques.`,
			//message: `Seek additional ${skillOrTopic} help if needed.`
			study_resource: { name: `${skillOrTopic} mocked study resource`, href: null },
			suggestions: `${skillOrTopic} suggestion`,
		},
		{
			min: 0.4,
			max: 0.59,
			message: `🟡Continue practicing ${skillOrTopic} regularly.`,
			//message: `Explore advanced ${skillOrTopic} topics.`
			study_resource: { name: `${skillOrTopic} mocked study resource`, href: null },
			suggestions: `${skillOrTopic} suggestion`,
		},
		{
			min: 0.6,
			max: 0.79,
			message: `🔵Work on challenging ${skillOrTopic} problems.`,
			//message: `Participate in ${skillOrTopic} discussions.`
			study_resource: { name: `${skillOrTopic} mocked study resource`, href: null },
			suggestions: `${skillOrTopic} suggestion`,
		},
		{
			min: 0.8,
			max: 1,
			message: `🟢Share ${skillOrTopic} knowledge with peers.`,
			//message: `Take up more complex ${skillOrTopic} tasks.`
			study_resource: { name: `${skillOrTopic} mocked study resource`, href: null },
			suggestions: `${skillOrTopic} suggestion`,
		},
	];
};
