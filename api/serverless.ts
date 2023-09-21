import * as dotenv from 'dotenv';
dotenv.config();

import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const app: FastifyInstance = Fastify();

app.register(import('../src/lib/server'));

export default async (req: FastifyRequest, res: FastifyReply) => {
	await app.ready();
	app.server.emit('request', req, res);
};
