import { FastifyReply } from 'fastify';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default (reply: FastifyReply, message: string = ReasonPhrases.NOT_FOUND) => {
	reply.status(StatusCodes.NOT_FOUND);

	return reply.send({
		error: ReasonPhrases.NOT_FOUND,
		message,
		statusCode: StatusCodes.NOT_FOUND,
	});
};
