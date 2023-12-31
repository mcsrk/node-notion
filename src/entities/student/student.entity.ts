// Entities
import { STUDY_PLAN_CONFIG } from '../../constants/study_plan';
import { StudentGrades } from '../grades/student.grades.entity';
import { RichTextConstructor } from '../rich-text/rich.text';
import { Subject } from '../subject/subject.entity';
import { Table } from '../table/table.entity';
import { TopicOrSkill } from '../topic/topic.entity';

// Interface
import { IStudent } from './student.interface';

const FILE_TAG = '[Student]';

export class Student implements IStudent {
	id: string;
	name: string;
	email: string;
	class_name: string;
	// Logic
	grades: StudentGrades;
	studyPlan: Table;

	/** New instance of Student requires Async data which can't be retrived in a constructor.
	 *  Use Student.build() instead so it will be able to get the external data using async methods */
	private constructor(studentData: any, grades: StudentGrades, templateId: string) {
		// Validate and set user data
		const { objectId, name, email, class: class_name } = studentData;
		if (!(objectId && name && email)) {
			throw new Error(`${FILE_TAG} user data is missing or invalid: ${JSON.stringify(studentData)}.`);
		}
		this.id = objectId;
		this.name = name;
		this.email = email;
		this.class_name = class_name;

		this.grades = grades;
		this.studyPlan = new Table(templateId, STUDY_PLAN_CONFIG.STUDY_PLAN_HEADER_COLS);
	}

	public static async build(studentData: any, templateId: string): Promise<Student> {
		const subjects = studentData.grade.subjects.map(async (_subjectData: any): Promise<Subject> => {
			/** Create Subject instance and retrieves feedback from source*/
			const subject = new Subject(_subjectData);
			await subject.setSubjectFeedback();
			await subject.setSubtopicsFeedback();
			return subject;
		});

		const subjectsInstances = await Promise.all(subjects);
		const studentGrades = new StudentGrades(studentData.grade, subjectsInstances);
		return new Student(studentData.user, studentGrades, templateId);
	}

	populateWeeklyStudyPlan(): void {
		let subTopicsOfDifficulty: TopicOrSkill[] = [];
		this.grades.subjects.forEach((_subject: Subject) => {
			subTopicsOfDifficulty.push(..._subject.skillsOfDifficulty);
			subTopicsOfDifficulty.push(..._subject.topicsOfDifficulty);
		});

		subTopicsOfDifficulty.sort((a, b) => a.performance - b.performance);

		let subTopicsToStudyPerWeek: TopicOrSkill[][] = []; // [ week1 => [topic,topic], week2 => [topic,topic] ]
		for (let i = 0; i < subTopicsOfDifficulty.length; i += STUDY_PLAN_CONFIG.SUBTOPICS_PER_WEEK) {
			subTopicsToStudyPerWeek.push(subTopicsOfDifficulty.slice(i, i + STUDY_PLAN_CONFIG.SUBTOPICS_PER_WEEK));
		}
		const rows: RichTextConstructor[][][] = [];
		subTopicsToStudyPerWeek.forEach((weekTopics: TopicOrSkill[], weekIndex) => {
			// Structure rows
			const rowData: RichTextConstructor[][] = [[{ content: `${weekIndex + 1}`, bold: true }], [], [], []];
			weekTopics.forEach((topic: TopicOrSkill) => {
				const { name: resourceName, href: resourceHref } = topic.feedback.study_resource;

				const topicContent = `- ${topic.name} (${topic.performance * 100}%)\n`;
				// const topicPerformance = `(${topic.performance})\n`;
				const topicResource = `- ${resourceName}\n`;
				const topicSuggestion = `> ${topic.feedback.suggestions}\n`;

				// Ignores Week Number Week because is already added rowData[0] is the week number

				// Add Goal Column Text
				rowData[1].push({
					content: topicContent,
					bold: true,
					color: STUDY_PLAN_CONFIG.PERFORMANCE_COLOR(topic.performance),
				});

				// Add Study Resources Column Text
				rowData[2].push({
					content: topicResource,
					href: resourceHref ? resourceHref : undefined,
					bold: resourceHref ? true : false,
					color: resourceHref ? 'blue' : 'gray',
				});
				// Add Study Suggestions Column Text
				rowData[3].push({ content: topicSuggestion });
			});

			rows.push(rowData);
		});
		// Add rows to study plan
		rows.forEach((row) => this.studyPlan.addRow(row));

		this.studyPlan.addRow(STUDY_PLAN_CONFIG.LAST_WEEK_ROW(rows.length));
	}

	exportStudentToNotion(): { [key: string]: string } {
		const studentBasicInfoForNotion: { [key: string]: string } = {
			student_id: this.id,
			student_name: this.name,
			student_email: this.email,
		};

		const studentGradesForNotion = this.grades.exportStudentGradeForNotion();

		const studentInfoForNotion: { [key: string]: string } = {
			...studentBasicInfoForNotion,
			...studentGradesForNotion,
		};

		return studentInfoForNotion;
	}
}
