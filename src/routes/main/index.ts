import type { FastifyReply, FastifyRequest } from 'fastify';
import { HttpMethod } from '../../lib/constants';
import { download } from '../../lib/yandex-disk';
import sendNotFound from '../../lib/send-not-found';

export default [
	{
		handler: async ({ protocol, hostname }: FastifyRequest) => {
			const baseUrl = `${protocol}://${hostname}`;

			return {
				api: [
					{
						title: 'Мои работы и биография из github',
						url: `${baseUrl}/portfolio`,
					},
					{
						title: 'Доступ к общим файлам моего Яндекс.диска',
						url: `${baseUrl}/files/example.jpg`,
					},
					{
						title: 'Стихи.ру: страница автора',
						url: `${baseUrl}/writer/ldsel`,
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
