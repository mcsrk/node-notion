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
					{ name: 'Poetry', performance: 0.08 },
					{ name: 'Comparative Text', performance: 0.12 },
					{ name: 'Cloze Passage', performance: 0.3 },
				],

				skillsOfDifficulty: [
					{ name: 'Comprehension ', performance: 0.5 },
					{ name: 'Textual Analysis', performance: 0.98 },
					{ name: 'Contextual Understanding', performance: 0.78 },
				],
			},

			{
				name: SUBJECTS.MATH.NAME,
				performance: 0.2,
				topicsOfDifficulty: [
					{ name: 'Algebra', performance: 0.21 },
					{ name: 'Fractions', performance: 0.44 },
					{ name: 'Word Problems', performance: 0.63 },
				],
				skillsOfDifficulty: [
					{ name: 'Numerical operations', performance: 0.72 },
					{ name: 'Problem-solving', performance: 0.95 },
					{ name: 'Logic and reasoning', performance: 0.02 },
				],
			},
			{
				name: SUBJECTS.THINKING.NAME,
				performance: 0.5,
				topicsOfDifficulty: [
					{ name: 'Dialogue Flaws', performance: 0.31 },
					{ name: 'Strengthen & Weaken', performance: 0.32 },
					{ name: 'Logic Games', performance: 0.33 },
				],
				skillsOfDifficulty: [
					{ name: 'Analytical Thinking', performance: 0.34 },
					{ name: 'Textual Analysis', performance: 0.35 },
					{ name: 'Contextual Understanding', performance: 0.36 },
				],
			},
		],
	},
});
