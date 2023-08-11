import { StudentGrades } from '../grades/student.grades.entity';
import { Table } from '../table/table.entity';

export interface IStudent {
	id: string;
	name: string;
	email: string;
	class_name: string;
	grades: StudentGrades;
	studyPlan: Table;

	exportStudentToNotion(): { [key: string]: string };
}
