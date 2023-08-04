import { ColorType, RichTextConstructor } from '../entities/rich-text/rich.text';

const HEADER_COLS: RichTextConstructor[][] = [
	[{ content: 'Week', bold: true, color: 'blue' }],
	[{ content: 'Goal', bold: true, color: 'blue' }],
	[{ content: 'Resources', bold: true, color: 'blue' }],
	[{ content: 'Suggestions', bold: true, color: 'blue' }],
];

const LAST_WEEK_ACTIVITES = (rowsLength: number): RichTextConstructor[][] => {
	const lastRowValues: RichTextConstructor[][] = [
		[{ content: `${rowsLength + 1}`, bold: true }], // Weeks
		[{ content: 'Revision and Practice', bold: true }], // Goals
		[{ content: '- Review all previous topics and exercises.', bold: true }], // Resources
		// Suggestions
		[
			{
				content:
					'> Dedicate time to revise all previously covered topics and complete practice questions from each topic. \n',
				bold: true,
			},
			{
				content: '> Focus on areas that require additional reinforcement.\n',
				bold: true,
			},
			{
				content: '> Work on time management to improve speed and accuracy.\n',
				bold: true,
			},
		],
	];
	return lastRowValues;
};

const PERFORMANCE_COLOR = (performance: number): ColorType => {
	if (performance >= 0 && performance < 0.2) {
		return 'red';
	} else if (performance >= 0.2 && performance < 0.4) {
		return 'orange';
	} else if (performance >= 0.4 && performance < 0.6) {
		return 'yellow';
	} else if (performance > 0.6 && performance < 0.8) {
		return 'green';
	} else {
		return 'blue';
	}
};

export const STUDY_PLAN_CONFIG = Object.freeze({
	TEMPLATE_VARIABLE_NAME_TO_REPLACE: 'weekly_study_plan',
	SUBTOPICS_PER_WEEK: 2,
	STUDY_PLAN_HEADER_COLS: HEADER_COLS,
	LAST_WEEK_ROW: LAST_WEEK_ACTIVITES,
	PERFORMANCE_COLOR: PERFORMANCE_COLOR,
});
