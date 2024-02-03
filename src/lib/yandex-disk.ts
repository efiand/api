import fetch from 'cross-fetch';
import { HttpMethod } from '../lib/constants';
import checkStatus from '../lib/check-status';
import getContentType from '../lib/get-content-type';

const { YADISK_TOKEN } = process.env;
const Append = {
	download: 'fields=href',
	upload: 'overwrite=true&fields=href'
};

const getUrl = async (filename: string, mode: 'download' | 'upload') => {
	const { href }: { href: URL } = await fetch(
		`https://cloud-api.yandex.net/v1/disk/resources/${mode}?path=app:/shared/${filename}&${Append[mode]}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } }
	).then((response) => checkStatus(response) && response.json());

	return href.toString();
};

export const download = async (filename: string) => {
	const url = await getUrl(filename, 'download');
	const file = await fetch(url).then((response) => checkStatus(response) && response.arrayBuffer());

	return {
		file,
		contentType: getContentType(filename)
	};
};

export const upload = async (filename: string, payload: string) => {
	const url = await getUrl(filename, 'upload');

	return await fetch(url, {
		body: Buffer.from(payload),
		method: HttpMethod.PUT
	}).then((response) => checkStatus(response));
};
