import { FastifyRequest, FastifyReply } from 'fastify';
import { HttpMethod } from './constants';
import { IncomingHttpHeaders } from 'http';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const { API_KEY } = process.env;

const isCheckable = (method: string): boolean => method === HttpMethod.DELETE || method === HttpMethod.POST || method === HttpMethod.PUT;
const isAuthorized = (headers: IncomingHttpHeaders) => {
	const allowed = headers.authorization === `Bearer ${API_KEY}`;
	const allowedForTelegram = headers['x-telegram-bot-api-secret-token'] === API_KEY;
	return allowed || allowedForTelegram;
};

export const handleRequest = async (request: FastifyRequest, reply: FastifyReply) => {
	const { headers, method } = request;

	if (isCheckable(method) && !isAuthorized(headers)) {
		reply.status(StatusCodes.FORBIDDEN);

		return reply.send({
			error: ReasonPhrases.FORBIDDEN,
			message: 'Access denied',
			statusCode: StatusCodes.FORBIDDEN,
		});
	}
};
