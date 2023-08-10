import { Router } from 'express';
import {
	createTableInTestPage,
	notionDbViewFeedbackRow,
	synapDemoDataInspector,
	insertFeedbackEntiresAutomatically,
} from '../controllers/debug.controller';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = Router();

router.route('/create-table').get(createTableInTestPage);
router.route('/notion-db-view-feedback-row').get(ValidateJoi(Schemas.subject.getFeedbackRow), notionDbViewFeedbackRow);
router.route('/synap-inspector').get(synapDemoDataInspector);
router.route('/generate-feedback-rows').get(insertFeedbackEntiresAutomatically);
export default router;
