import express from 'express';

import { CONFIG } from './config/config';

import roadmapRoutes from './routes/roadmap.routes';

const app = express();

app.use('/notion', notionRoute);

app.get('/', (req, res) => {
	res.send('Notion roadmap manipulator - Scholary');
});

app.use('/students', roadmapRoutes);
const PORT = 8000;

app.listen(PORT, () => {
	console.log(`Running on PORT http://localhost:${CONFIG.SERVER.PORT}`);
});
