// Repositories
import { getExternalFeedbackByPerformance } from '../../repositories/feedback.repository';

// Utils
import { floatToPerformance } from '../../utils/utils';

// Entities
import { FeedbackRange } from '../feedback/feedback.entity';
import { TopicOrSkill } from '../topic/topic.entity';
import { ISubject } from './subject.interface';

// Custom Libraries
import Logging from '../../library/Logging';

// Constants
import { findSubjectNotionPrefixByName } from '../../constants/subjects';

const FILE_TAG = '[Subject]';

export class Subject implements ISubject {
	name: string;
	performance: number;

	topicsOfDifficulty: TopicOrSkill[] = [];
	skillsOfDifficulty: TopicOrSkill[] = [];

	/** Subject special comments based on the performance */
	feedback: FeedbackRange = new FeedbackRange({});

	constructor(_subject: any) {
		if (!('name' in _subject) || _subject.name === '') {
			throw new Error(`${FILE_TAG} subject has no name: ${_subject.name}`);
		} else {
			this.name = _subject.name;
		}

		if (!('performance' in _subject) || isNaN(_subject.performance) || isNaN(Number(_subject.performance))) {
			throw new Error(`${FILE_TAG} subject has no valid performance: ${_subject.performance}`);
		} else {
			this.performance = _subject.performance;
		}

		/** Sort subtopics from lowest performance to hiigher performance */
		if (!('topicsOfDifficulty' in _subject)) {
			throw new Error(`${FILE_TAG} subject has no topicsOfDifficulty: ${_subject.topicsOfDifficulty}`);
		} else {
			let tds: TopicOrSkill[] = _subject.topicsOfDifficulty.map((td: any) => new TopicOrSkill(td));
			tds.sort((a: TopicOrSkill, b: TopicOrSkill) => a.performance - b.performance);
			this.topicsOfDifficulty = tds;
		}

		if (!('skillsOfDifficulty' in _subject)) {
			throw new Error(`${FILE_TAG} subject has no skillsOfDifficulty: ${_subject.skillsOfDifficulty}`);
		} else {
			let tss: TopicOrSkill[] = _subject.skillsOfDifficulty.map((ts: any) => new TopicOrSkill(ts));
			tss.sort((a: TopicOrSkill, b: TopicOrSkill) => a.performance - b.performance);
			this.skillsOfDifficulty = tss;
		}
	}

	/** Get subject's feedback based on performance */
	async setSubjectFeedback(): Promise<void> {
		const subjectFeedback = await getExternalFeedbackByPerformance(this.name, this.performance);
		this.feedback = subjectFeedback;
	}

	async setSubtopicsFeedback(): Promise<void> {
		/** Adapt student data and feedback data to this server valid structure */

		const subtopics: TopicOrSkill[] = [...this.skillsOfDifficulty, ...this.topicsOfDifficulty];

		const subtopicsFeedbackPromises = subtopics.map(
			async (_subtopic: TopicOrSkill) =>
				/** Create Subject instance and retrieves feedback from source*/
				await _subtopic.setSubtopicFeedback(),
		);

		await Promise.all(subtopicsFeedbackPromises);
	}

	private exportImprovementStrategies(): { [key: string]: string } {
		const subjectNotionPrefix = findSubjectNotionPrefixByName(this.name);
		/** Merge and Sort the subtopics from worst performance to higher performacne
		 *  so the strategies will be sorted from more important to less important */
		const subTopics: TopicOrSkill[] = [...this.topicsOfDifficulty, ...this.skillsOfDifficulty];
		subTopics.sort((a: TopicOrSkill, b: TopicOrSkill) => a.performance - b.performance);

		let exportedStrategies: { [key: string]: string } = {};

		subTopics.forEach((subTopic: TopicOrSkill, index) => {
			const numeration = index + 1;

			/** Add subtopics strategies */
			const subTopicStrategy = subTopic.exportStrategyForNotion(`${subjectNotionPrefix}_imprv_strategies_${numeration}`);
			exportedStrategies = { ...exportedStrategies, ...subTopicStrategy };
		});

		return exportedStrategies;
	}

	exportGradesForNotion(): { [key: string]: string } {
		const FUNC_TAG = '.[exportGradesForNotion]';
		let exportSubject: { [key: string]: string } = {};
		const subjectNotionPrefix = findSubjectNotionPrefixByName(this.name);

		if (!subjectNotionPrefix) {
			throw new Error(`${FILE_TAG}${FUNC_TAG} no notion prefix found for subject name: ${this.name}`);
		}

		exportSubject[`${subjectNotionPrefix}_perf`] = floatToPerformance(this.performance);

		this.topicsOfDifficulty.forEach((topic: TopicOrSkill, index) => {
			const numeration = index + 1;
			exportSubject[`${subjectNotionPrefix}_td_${numeration}`] = topic.name;
			exportSubject[`${subjectNotionPrefix}_td_perf_${numeration}`] = floatToPerformance(topic.performance);
		});

		this.skillsOfDifficulty.forEach((skill: TopicOrSkill, index) => {
			const numeration = index + 1;
			exportSubject[`${subjectNotionPrefix}_sd_${numeration}`] = skill.name;
			exportSubject[`${subjectNotionPrefix}_sd_perf_${numeration}`] = floatToPerformance(skill.performance);
		});

		// Get the feedback exported data
		const specialComments = this.feedback.exportFeedbackMessageForNotion(`${subjectNotionPrefix}_special_comments`);
		const improvementStrategies = this.exportImprovementStrategies();
		// Merge the feedbackData into the exportSubject
		exportSubject = { ...exportSubject, ...specialComments, ...improvementStrategies };

		return exportSubject;
	}
}
