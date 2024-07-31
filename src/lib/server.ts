import type { FastifyInstance, FastifyServerOptions, RouteOptions } from 'fastify';
import routes from '../routes';
import { handleRequest } from './hooks';

export const initServer = async (server: FastifyInstance) => {
	routes.forEach((route: RouteOptions) => server.route(route));

	server.addHook('onRequest', handleRequest);
};

export default async (server: FastifyInstance, opts: FastifyServerOptions, done: () => void) => {
	await initServer(server);
	done();
};
