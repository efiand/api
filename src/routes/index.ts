import mainRoutes from './main';
import telegramRoutes from './telegram';
import writerRoutes from './writer';

export default [
	...mainRoutes,
	...telegramRoutes,
	...writerRoutes,
];
