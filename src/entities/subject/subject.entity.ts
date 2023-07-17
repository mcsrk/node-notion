// Repositories
import { getFeedbackBySubjectAndPerformance } from '../../repositories/feedback.repository';

// Utils
import { floatToPerformance } from '../../utils/utils';

// Entities
import { FeedbackRange } from '../feedback/feedback.entity';
import { TopicOrSkill } from '../topic/topic.entity';
import { ISubject } from './subject.interface';

// Constants
import { findSubjectNotionPrefixByName } from '../../constants/subjects';

const FILE_TAG = '[Subject]';

export class Subject implements ISubject {
	name: string;
	performance: number;

	topicsOfDifficulty: TopicOrSkill[] = [];
	skillsOfDifficulty: TopicOrSkill[] = [];

	/** Subject feedback based on the performance */
	feedback: FeedbackRange;

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

		if (!('topicsOfDifficulty' in _subject)) {
			throw new Error(`${FILE_TAG} subject has no topicsOfDifficulty: ${_subject.topicsOfDifficulty}`);
		} else {
			const tds: TopicOrSkill[] = _subject.topicsOfDifficulty.map((td: any) => new TopicOrSkill(td));
			this.topicsOfDifficulty = tds;
		}

		if (!('skillsOfDifficulty' in _subject)) {
			throw new Error(`${FILE_TAG} subject has no skillsOfDifficulty: ${_subject.skillsOfDifficulty}`);
		} else {
			const tss: TopicOrSkill[] = _subject.skillsOfDifficulty.map((ts: any) => new TopicOrSkill(ts));
			this.skillsOfDifficulty = tss;
		}

		/** Get subject's feedback based on performance */
		const studentFeedback = getFeedbackBySubjectAndPerformance(_subject.name, _subject.performance);
		this.feedback = studentFeedback;
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
		const feedbackData = this.feedback.exportFeedbackForNotion(this.name);

		// Merge the feedbackData into the exportSubject
		exportSubject = { ...exportSubject, ...feedbackData };

		return exportSubject;
	}
}
