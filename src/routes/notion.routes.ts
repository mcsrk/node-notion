import { Router } from 'express';
import createRoadmap from '../controllers/notion.controller';
const router = Router();

router.route('/').post(createRoadmap);

export default router;
