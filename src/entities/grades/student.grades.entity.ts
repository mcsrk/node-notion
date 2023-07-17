import { IStudentGrades } from './student.grades.interface';
import { Subject } from '../subject/subject.entity';

// Utils
import { floatToPerformance } from '../../utils/utils';

// Custom library
import Logging from '../../library/Logging';

const TAG = '[StudentGrades]';

export class StudentGrades implements IStudentGrades {
	name: string;
	overall_perf: number;

	/** Math */
	subjects: Subject[] = [];

	constructor(_grades: any) {
		if (!('overall' in _grades) || isNaN(_grades.overall)) {
			Logging.warning(`${TAG} overall is not a valid number: ${_grades.overall}. overall_perf will be set to 0.`);
			this.overall_perf = 0;
		} else {
			this.overall_perf = _grades.overall;
		}

		if (!('name' in _grades) || _grades.name === '') {
			Logging.warning(`${TAG} grades has no valid name name: ${_grades.name}. Name will be set to "No Course".`);
			this.name = 'No Course or Grade';
		} else {
			this.name = _grades.name;
		}
		if (!('subjects' in _grades) || _grades.subjects.length === 0) {
			Logging.warning(`${TAG} grades has no subjects: ${_grades.subjects}. subjects will be left as [].`);
			this.subjects = [];
		} else {
			const subjectsInstances = _grades.subjects.map((_subject: any) => new Subject(_subject));
			this.subjects = subjectsInstances;
		}
	}

	exportStudentGradeForNotion(): { [key: string]: string } {
		const replacements: { [key: string]: string } = {
			grade_name: this.name,
			overall_perf: floatToPerformance(this.overall_perf),
		};

		// Step 1: Create an empty object to hold the subjects' export data
		const subjectsData: { [key: string]: string } = {};

		// Step 2: Iterate through each subject and get its export data
		for (const subject of this.subjects) {
			const subjectExportData = subject.exportGradesForNotion();
			// Step 3: Merge the subject's export data into the replacements object
			Object.assign(subjectsData, subjectExportData);
		}

		// Merge subjectsData into replacements
		Object.assign(replacements, subjectsData);

		return replacements;
	}
}
