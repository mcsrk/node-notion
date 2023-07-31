import { Router } from 'express';
import { createTableInTestPage, notionDbViewFeedbackRow } from '../controllers/debug.controller';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = Router();

router.route('/create-table').get(createTableInTestPage);
router.route('/notion-db-view-feedback-row').get(ValidateJoi(Schemas.subject.getFeedbackRow), notionDbViewFeedbackRow);
export default router;
