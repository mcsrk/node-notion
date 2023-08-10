import { isFullBlock, isFullPage } from '@notionhq/client';
import {
	AppendBlockChildrenParameters,
	BlockObjectRequest,
	CreatePageParameters,
	GetPageResponse,
	ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Constants
import { STUDY_PLAN_CONFIG } from '../constants/study_plan';
import Logging from '../library/Logging';

const FILE_TAG = '[RoadmapTemplate]';
export class RoadmapTemplate {
	page: CreatePageParameters = {
		parent: { page_id: '', type: 'page_id' },
		icon: {
			emoji: '🧵',
		},
		cover: {
			external: {
				// Photo by Todd Diemer on Unsplash
				url: 'https://unsplash.com/photos/ImgYcloGOCU/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTU3fHxyZWxheHxlbnwwfHx8fDE2NDA0MDUyNTQ&force=true&w=2400',
			},
		},
		properties: {
			title: {
				title: [
					{
						text: {
							content: 'Default',
						},
					},
				],
			},
		},
		children: [],
	};
	blocksToAppend: AppendBlockChildrenParameters = { block_id: '', children: [] };

	constructor(templatePage: GetPageResponse) {
		if (!isFullPage(templatePage)) {
			throw new Error(`${FILE_TAG} templatePage is not a Full Page`);
		}
		if (!templatePage.object || templatePage.object !== 'page') {
			throw new Error(`${FILE_TAG} templatePage is not a page object`);
		}
		if (!('parent' in templatePage)) {
			throw new Error(`${FILE_TAG} templatePage has no parent`);
		}
		if (!('page_id' in templatePage.parent)) {
			throw new Error(`${FILE_TAG} templatePage has no page as a parent`);
		}
		if (!('cover' in templatePage) || !templatePage.cover) {
			Logging.error(JSON.stringify(templatePage));
			throw new Error(`${FILE_TAG} templatePage has no cover`);
		}
		if (!('file' in templatePage.cover)) {
			throw new Error(`${FILE_TAG} templatePage.cover has no file`);
		}
		if (!('icon' in templatePage) || !templatePage.icon) {
			throw new Error(`${FILE_TAG} templatePage has no icon`);
		}
		if (!('emoji' in templatePage.icon)) {
			throw new Error(`${FILE_TAG} templatePage.icon has no emoji`);
		}

		if (!('properties' in templatePage)) {
			throw new Error(`${FILE_TAG} templatePage has no properties`);
		}
		//Logging.warning(`[URL] ${templatePage.cover.file.url}`);
		this.page.parent = templatePage.parent;
		this.page.cover = { external: { url: templatePage.cover.file.url }, type: 'external' };
		this.page.icon = templatePage.icon;
		this.page.properties = templatePage.properties;
	}

	setBlocksToAppend(pageId: string, templateChildren: ListBlockChildrenResponse): void {
		const FUNC_TAG = '.[setBlocksToAppend]';

		if (!('results' in templateChildren) || !templateChildren.results) {
			throw new Error(`${FILE_TAG}${FUNC_TAG} templateChildren has no results`);
		}

		const templatePageDuplicatedBlocks: any[] = templateChildren.results.map((retrievedBlock) => {
			if (isFullBlock(retrievedBlock)) {
				const {
					object,
					id,
					parent,
					created_time,
					last_edited_time,
					created_by,
					last_edited_by,
					has_children,
					archived,
					...blockStructure
				} = retrievedBlock;

				// const blockStructure = retrievedBlock[type];
				return blockStructure;
			}
		});

		this.blocksToAppend = {
			block_id: pageId, // TODO: move the assign to a clas method that has id and blocks response as parameters
			children: templatePageDuplicatedBlocks,
		};
	}

	changePageTitle(studentName: string): void {
		const newTitle = `${studentName} Roadmap`;
		this.page.properties.title = {
			title: [
				{
					text: {
						content: newTitle,
					},
				},
			],
		};
	}
	changePageParent(newParentId: string): void {
		this.page.parent = {
			type: 'page_id',
			page_id: newParentId,
		};
	}

	setWeeklyStudyPlanBlockToAppend(table: BlockObjectRequest): number {
		const weeklyStudyPlanBlockIndex = this.blocksToAppend.children.findIndex((item) => {
			return (
				item.type === 'paragraph' &&
				item.paragraph.rich_text &&
				item.paragraph.rich_text[0] &&
				item.paragraph.rich_text[0].type === 'text' &&
				item.paragraph.rich_text[0].text.content === STUDY_PLAN_CONFIG.TEMPLATE_VARIABLE_NAME_TO_REPLACE
			);
		});

		this.blocksToAppend.children[weeklyStudyPlanBlockIndex] = table;

		return weeklyStudyPlanBlockIndex;
	}

	replaceTemplateValues(exportedStudentGradeForNotion: { [key: string]: string }): string {
		/** Expected fields structure to replace in template */
		const replacements: { [key: string]: any } = {
			//TODO: include the student name
			student_name: 'Jhoncito',
			/**Student info */
			grade_name: 'Primary 4th Grade',
			overall_perf: 8,

			/** Subject Performance with Skills and Topics of difficulty */
			math_perf: '27%',

			math_td_1: 'MathTD 1',
			math_td_perf_1: 'math td 1 xx %',
			math_td_2: 'MathTD 2',
			math_td_perf_2: 'math td 2 xx %',
			math_td_3: 'MathTD 3',
			math_td_perf_3: 'math td 3 xx %',

			math_sd_1: 'Math Skill D 1',
			math_sd_perf_1: 'math sd 1 xx %',
			math_sd_2: 'Math Skill D 2',
			math_sd_perf_2: 'math sd 2 xx %',
			math_sd_3: 'Math Skill D 3',
			math_sd_perf_3: 'math sd 3 xx %',

			/** Fecdback */
			math_special_comments: 'math special comments from dummy code',
			math_imprv_strategies_1: 'math improve strategies 1 from dummy code',
			math_imprv_strategies_2: 'math improve strategies 2 from dummy code',
			math_imprv_strategies_3: 'math improve strategies 3 from dummy code',
			math_imprv_strategies_4: 'math improve strategies 4 from dummy code',
		};

		const jsonStringifiedChildren = JSON.stringify(this.blocksToAppend);

		const replaced = jsonStringifiedChildren.replace(
			new RegExp(Object.keys(exportedStudentGradeForNotion).join('|'), 'g'),
			(match) => exportedStudentGradeForNotion[match as keyof typeof exportedStudentGradeForNotion],
		);

		this.blocksToAppend = JSON.parse(replaced);
		return replaced;
	}
}
