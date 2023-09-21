import { HttpMethod } from '../../lib/constants';

export default [
	{
		handler: () => {
			return {
				api: ['https://api.efiand.vercel.app/portfolio']
			};
		},
		method: HttpMethod.GET,
		url: '/'
	}
];
