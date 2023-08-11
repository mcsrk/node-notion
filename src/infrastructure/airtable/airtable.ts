// Config
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';
import Airtable from 'airtable';

const FILE_TAG = '[AirtableClient]';
type TopicRecord = {
	name: any;
	subject: any;
	tag: any;
	feedBack: any;
};
export class AirtableClient {
	airtable = new Airtable({ endpointUrl: 'https://api.airtable.com', apiKey: CONFIG.AIRTABLE.ACCESS_TOKEN }).base(
		'appsI0F2vaFcx2GnQ',
	);

	constructor() {
		if (!CONFIG.AIRTABLE.ACCESS_TOKEN) {
			throw new Error(`${FILE_TAG} No Access Token in Airtable config in .env`);
		}
	}

	async getSubjects(): Promise<any[]> {
		const FUNC_TAG = '.[getSubjects]';
		Logging.info(`${FILE_TAG}${FUNC_TAG}`);

		return new Promise<any[]>((resolve, reject) => {
			const subjectsArray: any[] = [];

			this.airtable('SUBJECTS')
				.select({
					view: 'Grid view',
				})
				.eachPage(
					(records, fetchNextPage) => {
						records.forEach((record) => {
							const subjectName = record.get('SUBJECT');
							subjectsArray.push(subjectName);
						});
						// recordsArray.push(...records);
						fetchNextPage();
					},
					function done(err) {
						if (err) {
							Logging.error(err);
							reject(err);
							return;
						}

						resolve(subjectsArray);
					},
				);
		});
	}

	async retrieveAirtableFeedback(): Promise<TopicRecord[]> {
		const FUNC_TAG = '.[retrieveAirtableFeedback]';
		Logging.info(`${FILE_TAG}${FUNC_TAG} `);

		return new Promise<TopicRecord[]>((resolve, reject) => {
			const recordsArray: TopicRecord[] = [];

			this.airtable('TOPICS')
				.select({
					view: 'Grid view',
				})
				.eachPage(
					(records, fetchNextPage) => {
						records.forEach((record) => {
							const name = record.get('Name');
							const subject = record.get('Subject');
							const tag = record.get('Tag');

							const feedBack = {
								'0-19': record.get('0-19%'),
								'20-39': record.get('20-39%'),
								'40-59': record.get('40-59%'),
								'60-79': record.get('60-79%'),
								'80-100': record.get('80-100%'),
							};

							recordsArray.push({ name, subject, tag, feedBack });
						});

						fetchNextPage();
					},
					function done(err) {
						if (err) {
							Logging.error(err);
							reject(err);
							return;
						}

						resolve(recordsArray);
					},
				);
		});
	}
}
