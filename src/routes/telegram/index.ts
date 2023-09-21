import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpMethod } from '../../lib/constants';
import TelegramBot, { SendMessageOptions } from 'node-telegram-bot-api';

const { TG_ADMIN_ID, TG_TOKEN } = process.env;

const messageOptions: SendMessageOptions = {
	parse_mode: 'Markdown'
};

interface TelegramRequest extends FastifyRequest {
	body: {
		message: {
			chat: {
				id: number;
				username: string;
			};
			text: string;
		};
	};
}

export default [
	{
		handler: async ({ body }: TelegramRequest, reply: FastifyReply) => {
			if (body.message) {
				const bot = new TelegramBot(TG_TOKEN);

				const {
					chat: { id, username },
					text
				} = body.message;

				const user = username ? `@${username}` : id;
				const template = `\`\`\`\n${text}\n\`\`\``;

				if (id !== parseInt(TG_ADMIN_ID, 10)) {
					await bot.sendMessage(TG_ADMIN_ID, `Сообщение от ${user}:\n${template}`, messageOptions);

					const answer = `Вы писали нам:\n${template}\nСпасибо за обращение! Наш администратор ответит Вам в ближайшее время.`;
					const addition =
						'\nЛогин в telegram отсутствует. Пожалуйста, пришлите ссылку для обратной связи.';

					await bot.sendMessage(id, `${answer}${username ? '' : addition}`, messageOptions);
				}
			}

			reply.send('OK');
		},
		method: HttpMethod.POST,
		url: '/telegram'
	}
];
