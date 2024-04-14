import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpMethod, HOSTNAME } from '../../lib/constants';
import { download } from '../../lib/yandex-disk';
import sendNotFound from '../../lib/send-not-found';

export default [
	{
		handler: () => {
			return {
				api: [
					{
						title: 'Мои работы и биография из github',
						url: `https://${HOSTNAME}/portfolio`,
					},
					{
						title: 'Доступ к общим файлам моего Яндекс.диска',
						url: `https://${HOSTNAME}/files/example.jpg`,
					},
				],
			};
		},
		method: HttpMethod.GET,
		url: '/',
	},
	{
		handler: async (req: FastifyRequest<{
			Params: { filename: string };
		}>, res: FastifyReply) => {
			const { filename } = req.params;

			try {
				const { file, contentType } = await download(filename);

				res.header('Cache-Control', 'public, max-age=6048000');
				res.header('Content-Length', file.byteLength.toString());
				res.header('Content-Type', contentType);

				return Buffer.from(file);
			} catch (err) {
				sendNotFound(res, `Файл ${filename} не найден.`);
			}
		},
		method: HttpMethod.GET,
		url: '/files/:filename',
	},
];
