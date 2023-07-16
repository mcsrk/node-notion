import { SUBJECTS } from '../constants/subjects';

export const demoStudentData = {
	user: {
		name: 'Andres Carne de Res',
		objectId: 'userID54321',
		email: 'andres@gmail.com',
	},
	grades: {
		name: 'Year 5 Selective',
		overall: 0.84,
		subjects: [
			{
				name: SUBJECTS.MATH,
				performance: 0.1,
				topicsOfDifficulty: [
					{ name: 'Poetry', performance: 0.11 },
					{ name: 'Comparative Text', performance: 0.12 },
					{ name: 'Cloze Passage', performance: 0.13 },
				],
				skillsOfDifficulty: [
					{ name: 'Comprehension ', performance: 0.14 },
					{ name: 'Textual Analysis', performance: 0.15 },
					{ name: 'Contextual Understanding', performance: 0.16 },
				],
			},
			{
				name: SUBJECTS.READING,
				performance: 0.2,
				topicsOfDifficulty: [
					{ name: 'Algebra ', performance: 0.21 },
					{ name: 'Fractions ', performance: 0.22 },
					{ name: 'Word Problems', performance: 0.23 },
				],
				skillsOfDifficulty: [
					{ name: 'Numerical operations', performance: 0.24 },
					{ name: 'Problem-solving', performance: 0.25 },
					{ name: 'Logic and reasoning', performance: 0.26 },
				],
			},
			{
				name: SUBJECTS.THINKING,
				performance: 0.3,
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
};
