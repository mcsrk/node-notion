import { Request, Response } from 'express';
import { NotionClient } from '../infrastructure/notion';

const FILE_TAG = '[Notion controller]';

const createRoadmap = async (req: Request, res: Response) => {
	const FUNC_TAG = '.[createRoadMap]';

	const notionClient = new NotionClient();

	const { template } = req.query;
	if (!template || typeof template !== 'string') {
		return res.status(404).json({ message: `Query field template must be a string` });
	}

	console.info(FILE_TAG, FUNC_TAG, 'Function started!');
	console.info(FILE_TAG, FUNC_TAG, 'query: ', template);

	let status = 200;

	const searchResponse = await notionClient.searchPageOrDatabase(template);
	if (searchResponse.results.length === 0) {
		return res.status(404).json({ message: `Template: '${template}' not found` });
	}
	const pageId = searchResponse.results[0].id;
	const templatePage = await notionClient.getPage(pageId);

	let returns = templatePage;
	// console.log(FILE_TAG, FUNC_TAG, 'Returning:', returns);
	return res.status(status).json(returns);
};
export default createRoadmap;
