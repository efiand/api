import type { FastifyRequest } from 'fastify';
import type { Work, Writer } from './schema';
import { HttpMethod } from '../../lib/constants';
import fetch from 'cross-fetch';
import * as cheerio from 'cheerio';
import Typograf from 'typograf';
import { genres } from './data';

const typograf = new Typograf({
	locale: [
		'ru',
		'en-US',
	],
});

const prepare = (text: string) => {
	return typograf.execute(`<p>${text
		.replaceAll('<br>\n<br>\n', '</p><p>')
		.replaceAll('<br>\n', '')}</p>`);
};

export default [
	{
		handler: async (req: FastifyRequest<{
			Params: { id: string };
		}>) => {
			const { id } = req.params;
			const res = await fetch(`https://stihi.ru/avtor/${id}`);
			const content = await res.arrayBuffer()
				.then((buffer) => new TextDecoder('windows-1251').decode(buffer));

			const $ = cheerio.load(content);
			const bio = $('h1 + #textlink').html();
			const data: Writer = {
				id,
				name: $('h1').text(),
				biography: bio.includes('/login/messages.html?') ? '' : prepare(bio),
				books: Array.from($('#bookheader a'), (element) => {
					const $element = $(element);
					return {
						id: Number($element.attr('name') || $element.attr('href').match(/\d+$/)[0]),
						title: typograf.execute($element.text()),
					};
				}),
				works: [],
			};
			data.works = Array.from($('.poemlink'), (element) => {
				const $link = $(element);
				const description = $link.next().text();
				const [, genre, day, month, year, hours, minutes] = description.match(/- (.*), (\d+)\.(\d+)\.(\d+) (\d+):(\d+)/);
				const work: Work = {
					url: $link.attr('href'),
					title: typograf.execute($link.text()),
					date: Date.parse(`${year}-${month}-${day}T${hours}:${minutes}:00.000+03:00`),
				};
				if (data.books.length) {
					work.bookId = 1;
				}
				const genreId = genres.indexOf(genre);
				if (genreId > 0) {
					work.genreId = genreId;
				}
				return work;
			});
			return data;
		},
		method: HttpMethod.GET,
		url: '/writer/:id',
	},
];
