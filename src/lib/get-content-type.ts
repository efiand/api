export default (filename: string) => {
	if (/\.jpg/.test(filename)) {
		return 'image/jpeg';
	}
	if (/\.png/.test(filename)) {
		return 'image/png';
	}
	if (/\.webp/.test(filename)) {
		return 'image/webp';
	}
	if (/\.svg/.test(filename)) {
		return 'image/svg+xml';
	}
	return 'application/octet-stream';
};
