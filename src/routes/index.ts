import mainRoutes from './main';
import proxyRoutes from './proxy';
import telegramRoutes from './telegram';
import writerRoutes from './writer';

export default [
	...mainRoutes,
	...proxyRoutes,
	...telegramRoutes,
	...writerRoutes,
];
