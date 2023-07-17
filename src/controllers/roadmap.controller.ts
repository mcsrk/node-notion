import { Request, Response } from 'express';

// Infrastructure
import { NotionClient } from '../infrastructure/notion/notion';

// Entites
import { RoadmapTemplate } from '../entities/template.entity';
import { StudentGrades } from '../entities/grades/student.grades.entity';
import { SynapStudent } from '../infrastructure/synap/student.entity';

// Mocke data
import { DEMO_STUDENT_DATA } from '../mocks/student';
import Logging from '../library/Logging';

const FILE_TAG = '[Notion controller]';

const getStudentRoadmap = async (req: Request, res: Response) => {};

const createRoadmap = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createRoadMap]';
	Logging.info(`${FILE_TAG} ${FUNC_TAG} Function started!`);
	try {
		const { studentId } = req.params;
		const notionClient = new NotionClient();
		const synapStudent = new SynapStudent(req.body);
		const studentGradeData = DEMO_STUDENT_DATA.grade;

		const studentName = synapStudent.getName();

		const { template } = req.query;

		if (!template || typeof template !== 'string') {
			return res.status(404).json({ message: `Query field template must be a string` });
		}

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
		const exportedSynapStudent = synapStudent.exportSynapStudentForNotion();
		const valuesToReplace: { [key: string]: string } = { ...exportedSynapStudent, ...exportedStudentScores };

		/** Replace blocks variables with student scores values and subjects comments */
		const stringifiedBlocks = templateInstance.replaceTemplateValues(valuesToReplace);
		await notionClient.appendChildren(templateInstance.blocksToAppend);

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
