import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';

// Custom modules
import Logging from '../library/Logging';

import { ISynapStudent } from '../infrastructure/synap/student.interface';

// Models

export const ValidateJoi = (schema: ObjectSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validateAsync(req.body);

			next();
		} catch (error) {
			Logging.error(`[ValidateJoi] ${error}`);
			return res.status(422).json({ error });
		}
	};
};

export const Schemas = {
	student: {
		createRoadmap: Joi.object<ISynapStudent>({
			user: {
				objectId: Joi.string().required(),
				name: Joi.string().required(),
				email: Joi.string().required(),
			},
		}),
	},
	subject: {
		getFeedbackRow: Joi.object({
			name: Joi.string().required(),
			performance: Joi.number().required(),
		}),
	},
};
