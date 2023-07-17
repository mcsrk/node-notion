import { SUBJECTS } from '../constants/subjects';

/** This student data should be recieved through the req.body of the POST request */
export const DEMO_STUDENT_DATA = Object.freeze({
	user: {
		name: 'Andres Carne de Res',
		objectId: 'userID54321',
		email: 'andres@gmail.com',
	},
	grade: {
		name: 'Year 5 Selective',
		overall: 0.84,
		subjects: [
			{
				name: SUBJECTS.READING.NAME,
				performance: 0.1,
				topicsOfDifficulty: [
					{ name: 'Poetry - Replaced from server', performance: 0.11 },
					{ name: 'Comparative Text - Replaced from server', performance: 0.12 },
					{ name: 'Cloze Passage', performance: 0.13 },
				],
				skillsOfDifficulty: [
					{ name: 'Comprehension  - Replaced from server', performance: 0.14 },
					{ name: 'Textual Analysis - Replaced from server', performance: 0.15 },
					{ name: 'Contextual Understanding - Replaced from server', performance: 0.16 },
				],
			},
			{
				name: SUBJECTS.MATH.NAME,
				performance: 0.2,
				topicsOfDifficulty: [
					{ name: 'Algebra  - Replaced from server', performance: 0.21 },
					{ name: 'Fractions  - Replaced from server', performance: 0.22 },
					{ name: 'Word Problems - Replaced from server', performance: 0.23 },
				],
				skillsOfDifficulty: [
					{ name: 'Numerical operations - Replaced from server', performance: 0.24 },
					{ name: 'Problem-solving - Replaced from server', performance: 0.25 },
					{ name: 'Logic and reasoning - Replaced from server', performance: 0.26 },
				],
			},
			{
				name: SUBJECTS.THINKING.NAME,
				performance: 0.5,
				topicsOfDifficulty: [
					{ name: 'Dialogue Flaws - Replaced from server', performance: 0.31 },
					{ name: 'Strengthen & Weaken - Replaced from server', performance: 0.32 },
					{ name: 'Logic Games - Replaced from server', performance: 0.33 },
				],
				skillsOfDifficulty: [
					{ name: 'Analytical Thinking - Replaced from server', performance: 0.34 },
					{ name: 'Textual Analysis - Replaced from server', performance: 0.35 },
					{ name: 'Contextual Understanding - Replaced from server', performance: 0.36 },
				],
			},
		],
	},
});
