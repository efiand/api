import { FastifyRequest } from 'fastify';

export default (request: FastifyRequest) => {
	const { hostname, protocol, url } = request;

	return `${protocol}://${hostname}${url}`;
};
