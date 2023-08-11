// Config
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';

const FILE_TAG = '[SynapClient]';

export class NotionClient {
	synapAPI: AxiosInstance;
	synapLambda: AxiosInstance;

	constructor() {
		if (!CONFIG.SYNAP.API.headers['X-api-key']) {
			throw new Error(`${FILE_TAG} No Synap Api Key in .env`);
		}

		this.synapAPI = axios.create({
			responseEncoding: 'utf8',
			responseType: 'json',
			...CONFIG.SYNAP.API,
		});
		this.synapLambda = axios.create({
			responseEncoding: 'utf8',
			responseType: 'json',
			...CONFIG.SYNAP.LAMBDA.SET_UP,
		});
	}

	async searchStudent(email: string): Promise<any> {
		const FUNC_TAG = '.[searchStudent]';
		try {
			const config: AxiosRequestConfig = {
				method: 'get',
				url: `users`,
				params: { email },
			};

			const response: AxiosResponse = await this.synapAPI(config);
			Logging.info(`${FILE_TAG}${FUNC_TAG} Response:`);
			Logging.info(`${response.data}`);
			return response.data;
		} catch (error) {
			// Manejo de errores, por ejemplo, puedes lanzar una excepción o retornar un objeto con el mensaje de error.
			Logging.error(`${FILE_TAG}${FUNC_TAG} Error searching student: ${email}`);
			Logging.error(error);
			throw new Error(`${FILE_TAG}${FUNC_TAG} Error searching student: ${email}`);
		}
	}
	async hitLambda(email: string): Promise<any> {
		const FUNC_TAG = '.[hitLambda]';
		try {
			const config: AxiosRequestConfig = {
				method: 'get',
				data: {
					portalId: '1t8EUQEApb',
					apiKey: CONFIG.SYNAP.LAMBDA.API_KEY,
				},
			};

			const response: AxiosResponse = await this.synapAPI(config);

			Logging.info(`${FILE_TAG}${FUNC_TAG} Response:`);
			Logging.info(`${response.data}`);

			return response.data;
		} catch (error) {
			// Manejo de errores, por ejemplo, puedes lanzar una excepción o retornar un objeto con el mensaje de error.
			Logging.error(`${FILE_TAG}${FUNC_TAG} Error excecuting the request: ${email}`);
			Logging.error(error);
			throw new Error(`${FILE_TAG}${FUNC_TAG} Error excecuting the request: ${email}`);
		}
	}
}
