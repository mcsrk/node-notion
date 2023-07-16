import express from 'express';

import { CONFIG } from './config/config';

import roadmapRoutes from './routes/roadmap.routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
	/** Requests from anywhere */
	res.header('Access-Control-Allow-Origin', '*');
	/** Headers allowed to use */
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	/** All of the options that can be used in this API */
	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}

	next();
});

app.get('/', (_, res) => {
	res.send('Notion roadmap microservice - Scholary');
});

app.use('/students', roadmapRoutes);

const PORT = 8000;

app.listen(PORT, () => {
	console.log(`Running on PORT http://localhost:${CONFIG.SERVER.PORT}`);
});
