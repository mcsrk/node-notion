import { Subject } from '../subject/subject.entity';

export interface IStudentGrades {
	overall_perf: number;
	name: string;

	/** Math */
	subjects: Subject[];
}
