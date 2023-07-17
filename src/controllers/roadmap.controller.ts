import { Request, Response } from 'express';
import { NotionClient } from '../infrastructure/notion';
import { RoadmapTemplate } from '../entities/template.entity';
import { ISynapStudent } from '../infrastructure/synap/student.interface';
import { StudentGrades } from '../entities/grades/student.grades.entity';

// Mocke data
import { DEMO_STUDENT_DATA } from '../mocks/student';

const FILE_TAG = '[Notion controller]';

const getStudentRoadmap = async (req: Request, res: Response) => {};

const createRoadmap = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createRoadMap]';
	console.info(FILE_TAG + FUNC_TAG, 'Function started!');

	const { studentId } = req.params;
	const studentData: ISynapStudent = req.body;
	const studentName = studentData.user.name;
	const studentGradeData = DEMO_STUDENT_DATA.grade;

	const notionClient = new NotionClient();

	const { template } = req.query;

	if (!template || typeof template !== 'string') {
		return res.status(404).json({ message: `Query field template must be a string` });
	}

	console.info(FILE_TAG + FUNC_TAG, 'query: ', template);

	try {
		const studentId_PageId = await notionClient.createStudentIdPage(studentId);

		const searchTemplate = await notionClient.searchPage(template);

		if (searchTemplate.results.length === 0) {
			return res.status(404).json({ message: `Template page: '${template}' not found in Notion workspace` });
		}

		const tempalteId = searchTemplate.results[0].id;
		const templatePage = await notionClient.getPage(tempalteId);
		const templatePageChildren = await notionClient.getPageBlockChildren(tempalteId);

		const templateInstance = new RoadmapTemplate(templatePage);

		templateInstance.changePageTitle(studentName);
		templateInstance.changePageParent(studentId_PageId);

		const studentRoadmapPageId = await notionClient.createStudentRoadmap(studentName, templateInstance.page);

		/** Duplicate and create blocks */
		templateInstance.setBlocksToAppend(studentRoadmapPageId, templatePageChildren);

		/** Adapt student data and feedback data to this server valid structure */
		const studentGrade = new StudentGrades(studentGradeData);

		/** Convert student scores from server nested data structure to plain object*/
		const exportedStudentScores = studentGrade.exportStudentGradeForNotion();

		/** Replace blocks variables with student scores values and subjects comments */
		const stringifiedBlocks = templateInstance.replaceTemplateValues(exportedStudentScores);
		await notionClient.appendChildren(templateInstance.blocksToAppend);

		let returns = {
			templatePage,
			templatePageChildren,
			studentPageId: studentId_PageId,
			stringifiedBlocks,
		};
		// console.log(FILE_TAG + FUNC_TAG, 'Returning:', returns);
		return res.status(200).json(returns);
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
const publishRoadmap = async (req: Request, res: Response) => {};

export { createRoadmap, getStudentRoadmap, publishRoadmap };
