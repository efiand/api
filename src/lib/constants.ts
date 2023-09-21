import type { HTTPMethods } from 'fastify';

export const DEFAULT_SERVER_PORT = 3000;

interface HttpMethodType {
	DELETE: HTTPMethods;
	GET: HTTPMethods;
	POST: HTTPMethods;
	PUT: HTTPMethods;
}

export const HttpMethod: HttpMethodType = {
	DELETE: 'DELETE',
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT'
};
