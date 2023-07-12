import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('Hola mundo');
});

const PORT = 8000;

app.listen(PORT, () => {
	console.log(`Running on PORT http://localhost:${PORT}`);
});
