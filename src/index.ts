import Fastify, { FastifyInstance } from 'fastify';
import initServer from './lib/server';
import { DEFAULT_SERVER_PORT } from './lib/constants';

const port: number = parseInt(process.env.SERVER_PORT || '', 10) || DEFAULT_SERVER_PORT;
const server: FastifyInstance = Fastify();

initServer(server, { logger: true }, () => {
	server.listen({ port });
	console.log(`http://localhost:${port}`);
});
