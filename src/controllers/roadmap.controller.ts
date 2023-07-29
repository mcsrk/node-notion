import { Request, Response } from 'express';

// Infrastructure
import NotionInstance from '../infrastructure/notion';

// Entites
import { RoadmapTemplate } from '../entities/template.entity';
import { StudentGrades } from '../entities/grades/student.grades.entity';
import { SynapStudent } from '../infrastructure/synap/student.entity';
import { Subject } from '../entities/subject/subject.entity';

// Custom Libraries
import Logging from '../library/Logging';
// Mocke data
import { DEMO_STUDENT_DATA } from '../mocks/student';

const FILE_TAG = '[Notion controller]';

const getStudentRoadmap = async (req: Request, res: Response) => {};

const createRoadmap = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createRoadMap]';
	Logging.info(`${FILE_TAG}${FUNC_TAG} Function started!`);
	try {
		const { studentId } = req.params;
		const synapStudent = new SynapStudent(req.body);
		const studentGradeData = DEMO_STUDENT_DATA.grade;

		const studentName = synapStudent.getName();

		const { template } = req.query;

		if (!template || typeof template !== 'string') {
			return res.status(404).json({ message: `Query field template must be a string` });
		}

		const studentId_PageId = await NotionInstance.createStudentIdPage(studentId);

		const searchTemplate = await NotionInstance.searchPage(template);

		if (searchTemplate.results.length === 0) {
			return res.status(404).json({ message: `Template page: '${template}' not found in Notion workspace` });
		}

		const tempalteId = searchTemplate.results[0].id;
		const templatePage = await NotionInstance.getPage(tempalteId);
		const templatePageChildren = await NotionInstance.getPageBlockChildren(tempalteId);

		const templateInstance = new RoadmapTemplate(templatePage);

		templateInstance.changePageTitle(studentName);
		templateInstance.changePageParent(studentId_PageId);

		const studentRoadmapPageId = await NotionInstance.createStudentRoadmap(studentName, templateInstance.page);

		/** Duplicate and create blocks */
		templateInstance.setBlocksToAppend(studentRoadmapPageId, templatePageChildren);

		/** Adapt student data and feedback data to this server valid structure */
		const subjects = studentGradeData.subjects.map(async (_subjectData: any) => {
			/** Create Subject instance and retrieves feedback from source*/
			const subject = new Subject(_subjectData);
			await subject.setSubjectFeedback();
			await subject.setSubtopicsFeedback();
			return subject;
		});

		const subjectsInstances = await Promise.all(subjects);
		const studentGrade = new StudentGrades(studentGradeData, subjectsInstances);

		/** Convert student scores from server nested data structure to plain object*/
		const exportedStudentScores = studentGrade.exportStudentGradeForNotion();
		const exportedSynapStudent = synapStudent.exportSynapStudentForNotion();
		const valuesToReplace: { [key: string]: string } = { ...exportedSynapStudent, ...exportedStudentScores };

		/** Replace blocks variables with student scores values and subjects comments */
		const stringifiedBlocks = templateInstance.replaceTemplateValues(valuesToReplace);
		await NotionInstance.appendChildren(templateInstance.blocksToAppend);

		let returns = {
			templatePage,
			templatePageChildren,
			studentPageId: studentId_PageId,
			stringifiedBlocks,
		};
		Logging.info(`${FILE_TAG}${FUNC_TAG} Returning`);
		return res.status(200).json(returns);
	} catch (error) {
		Logging.error((error as Error).message);
		Logging.error(error);

		res.status(500).json({
			message: `Error creating student roadmap`,
			error: (error as Error).message,
		});
	}
};
const publishRoadmap = async (req: Request, res: Response) => {};

export { createRoadmap, getStudentRoadmap, publishRoadmap };
