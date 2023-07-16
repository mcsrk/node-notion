import { Router } from 'express';
import { createRoadmap, getStudentRoadmap, publishRoadmap } from '../controllers/notion.controller';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = Router();

router.route('/:studentId/roadmap').get(getStudentRoadmap);
router.route('/:studentId/roadmap').post(ValidateJoi(Schemas.student.createRoadmap), createRoadmap);
router.route('/:studentId/roadmap/publish').post(publishRoadmap);

export default router;
