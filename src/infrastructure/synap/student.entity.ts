// Interface
import { ISynapStudent } from './student.interface';

const FILE_TAG = '[SynapStudent]';

export class SynapStudent implements ISynapStudent {
	user: {
		objectId: string;
		name: string;
		email: string;
	};

	constructor(synapStudentData: any) {
		// Validate and set user data
		const userData = synapStudentData.user;
		if (!(userData && userData.objectId && userData.name && userData.email)) {
			throw new Error(`${FILE_TAG} user data is missing or invalid: ${JSON.stringify(userData)}.`);
		}
		this.user = userData;
	}

	exportSynapStudentForNotion(): { [key: string]: string } {
		const exportSubject: { [key: string]: string } = {};

		exportSubject['student_id'] = this.user.objectId;
		exportSubject['student_name'] = this.user.name;
		exportSubject['student_email'] = this.user.email;

		return exportSubject;
	}

	getName() {
		return this.user.name;
	}

	getStudentId() {
		return this.user.objectId;
	}
}
