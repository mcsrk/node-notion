import { Request, Response } from 'express';

// Infrastructure
import NotionInstance from '../infrastructure/notion';

// Entites
import { RoadmapTemplate } from '../entities/template.entity';
import { SynapStudent } from '../infrastructure/synap/student.entity';

// Custom Libraries
import Logging from '../library/Logging';
// Mocke data
import { DEMO_STUDENT_DATA } from '../mocks/student';
import { Student } from '../entities/student/student.entity';

const FILE_TAG = '[Notion controller]';

const getStudentRoadmap = async (req: Request, res: Response) => {};

const createRoadmap = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createRoadMap]';
	Logging.info(`${FILE_TAG}${FUNC_TAG} Function started!`);
	try {
		// const { studentId } = req.params;
		const { objectId: studentId } = DEMO_STUDENT_DATA.user;
		const synapStudent = new SynapStudent(DEMO_STUDENT_DATA);
		const studentData = DEMO_STUDENT_DATA;

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

		const tempalteId = searchTemplate.results[0].id; // roadmap_template id
		const templatePage = await NotionInstance.getPage(tempalteId); // roadmap_template page
		const templatePageChildren = await NotionInstance.getPageBlockChildren(tempalteId); // roadmap_template page children
		const templateInstance = new RoadmapTemplate(templatePage);

		templateInstance.changePageTitle(studentName);
		templateInstance.changePageParent(studentId_PageId);

		const studentRoadmapPageId = await NotionInstance.createStudentRoadmap(studentName, templateInstance.page);

		/** Duplicate and create blocks */
		templateInstance.setBlocksToAppend(studentRoadmapPageId, templatePageChildren);

		/** While building the Student:
		 * - Automatically creates all of the subjects and for each one
		 * - Retrieves the related feedback entries from the Notion Feedback DB */
		const student = await Student.build(studentData, studentRoadmapPageId);

		/** Build the Weekly Study Plan Notion Table using the feedback retrieved */
		student.populateWeeklyStudyPlan();

		/** Inserts the Weekly Study Plan Table Request body into the template instance for the student */
		const weeklyStudyBlockToReplaceIndex = templateInstance.setWeeklyStudyPlanBlockToAppend(
			student.studyPlan.generateBlockRequestBody(),
		);

		if (weeklyStudyBlockToReplaceIndex === -1) {
			throw new Error(
				`Couldn't find the Weekly Study Block in template to replace as a table: ${weeklyStudyBlockToReplaceIndex}`,
			);
		}

		/** Replace the template values (basic info and subject/subtopics performance)
		 * with the student infromation and feedback messages */
		const valuesToReplace = student.exportStudentToNotion();
		const stringifiedBlocks = templateInstance.replaceTemplateValues(valuesToReplace);

		/** Do a POST Request to create the Student Roadmap out of the modified template */
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
