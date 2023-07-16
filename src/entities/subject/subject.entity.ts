import { findSubjectNotionPrefixByName } from '../../constants/subjects';
import { floatToPerformance } from '../../utils/utils';
import { TopicOrSkill } from '../topic/topic.entity';
import { ISubject } from './subject.interface';

const TAG = '[Subject]';

export class Subject implements ISubject {
	name: string;
	performance: number;

	topicsOfDifficulty: TopicOrSkill[] = [];
	skillsOfDifficulty: TopicOrSkill[] = [];

	constructor(_subject: any) {
		if (!('name' in _subject) || _subject.name === '') {
			throw new Error(`${TAG} subject has no name: ${_subject.name}`);
		} else {
			this.name = _subject.name;
		}

		if (!('performance' in _subject) || isNaN(_subject.performance) || isNaN(Number(_subject.performance))) {
			throw new Error(`${TAG} subject has no valid performance: ${_subject.performance}`);
		} else {
			this.performance = _subject.performance;
		}

		if (!('topicsOfDifficulty' in _subject)) {
			throw new Error(`${TAG} subject has no topicsOfDifficulty: ${_subject.topicsOfDifficulty}`);
		} else {
			const tds: TopicOrSkill[] = _subject.topicsOfDifficulty.map((td: any) => new TopicOrSkill(td));
			this.topicsOfDifficulty = tds;
		}

		if (!('skillsOfDifficulty' in _subject)) {
			throw new Error(`${TAG} subject has no skillsOfDifficulty: ${_subject.skillsOfDifficulty}`);
		} else {
			const tss: TopicOrSkill[] = _subject.skillsOfDifficulty.map((ts: any) => new TopicOrSkill(ts));
			this.skillsOfDifficulty = tss;
		}
	}

	exportGradesForNotion(): { [key: string]: string } {
		const exportSubject: { [key: string]: string } = {};
		const subjectNotionPrefix = findSubjectNotionPrefixByName(this.name);

		if (!subjectNotionPrefix) {
			throw new Error(`${TAG} no notion prefix found for subject name: ${this.name}`);
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

		return exportSubject;
	}
}
