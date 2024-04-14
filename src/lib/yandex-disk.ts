import fetch from 'cross-fetch';
import { HttpMethod } from '../lib/constants';
import checkStatus from '../lib/check-status';
import getContentType from '../lib/get-content-type';

type app = 'cookbook' | 'shared';

const { YADISK_TOKEN } = process.env;
const Append = {
	download: 'fields=href',
	upload: 'overwrite=true&fields=href',
};

const getUrl = async (filename: string, mode: 'download' | 'upload', appName: app) => {
	const { href }: { href: URL } = await fetch(
		`https://cloud-api.yandex.net/v1/disk/resources/${mode}?path=app:/${appName}/${filename}&${Append[mode]}`,
		{ headers: { Authorization: `OAuth ${YADISK_TOKEN}` } },
	).then((response) => checkStatus(response) && response.json());

	return href.toString();
};

export const download = async (filename: string) => {
	const url = await getUrl(filename, 'download', 'shared');
	const file = await fetch(url).then((response) => checkStatus(response) && response.arrayBuffer());

	return {
		file,
		contentType: getContentType(filename),
	};
};

export const upload = async (filename: string, payload: string, appName: app = 'shared') => {
	const url = await getUrl(filename, 'upload', appName);

	return await fetch(url, {
		body: Buffer.from(payload),
		method: HttpMethod.PUT,
	}).then((response) => checkStatus(response));
};
