/** Maps a subject and its respective preffix
 *  used in every subject-related variable in
 *  the Notion Roadmap Template */

export const DEFAULT_FEEDBACK = Object.freeze({
	MIN: 0,
	MAX: 100,
	MESSAGE: 'No feedback defined yet',
	STUDY_RESOURCE: (topicName: string) => ({
		name: `No resources available for ${topicName} yet`,
		href: null,
	}),
	SUGGESTIONS: (topicName: string) => `No suggestions available for ${topicName} yet`,
});
