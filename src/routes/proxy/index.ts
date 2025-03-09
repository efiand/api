import type { FastifyReply, FastifyRequest } from 'fastify';
import { HttpMethod } from '../../lib/constants';
import fetch from 'cross-fetch';
import checkStatus from '../../lib/check-status';
import getContentType from '../../lib/get-content-type';
import sendNotFound from '../../lib/send-not-found';

export default [
	{
		handler: async (req: FastifyRequest<{
			Querystring: { url: string };
		}>, res: FastifyReply) => {
			const { url } = req.query;
			const contentType = getContentType(url);

			try {
				const file = await fetch(url).then((response) => checkStatus(response) && response.arrayBuffer());

				res.header('Access-Control-Allow-Origin', '*');
				res.header('Cache-Control', 'public, max-age=6048000');
				res.header('Content-Length', file.byteLength.toString());
				res.header('Content-Type', contentType);

				return Buffer.from(file);
			} catch (err) {
				sendNotFound(res, `Файл ${url} не найден.`);
			}
		},
		method: HttpMethod.GET,
		url: '/proxy',
	},
];
