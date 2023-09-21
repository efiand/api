<?php
$headers = [
	'User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)',
	'Authorization: Basic '. base64_encode('efiand:' . $_ENV['GH_TOKEN'])
];

function adapt_repos($repo, $languages_data) {
	global $headers;

	$created_at = strtotime($repo['created_at']);
	$raw_languages = json_decode($languages_data, true);

	$languages = [];
	foreach ($raw_languages as $name => $count) {
		if ($count > 1000) {
			$languages[] = $name;
		}
	}

	array_splice($repo['topics'], array_search('portfolio-project', $repo['topics']), 1);

	return [
		'id' => $created_at,
		'date' => date('d.m.Y', $created_at),
		'description' => $repo['description'],
		'homepage' => $repo['homepage'],
		'languages' => $languages,
		'name' => $repo['name'],
		'topics' => $repo['topics'],
		'url' => $repo['html_url'],
		'year' => date('Y', $created_at)
	];
}

[$fetched_repositories, $bio] = multifetch([
	'https://api.github.com/users/efiand/repos?per_page=100',
	'https://raw.githubusercontent.com/efiand/efiand/main/README.md'
], $headers);
$raw_repositories = json_decode($fetched_repositories, true);

$languages_urls = [];
$filtered_repositories = [];
foreach ($raw_repositories as $repo) {
	if (array_search('portfolio-project', $repo['topics'])) {
		$languages_urls[] = $repo['languages_url'];
		$filtered_repositories[] = $repo;
	}
}

$languages_data = multifetch($languages_urls, $headers);

$repositories = [];
foreach ($filtered_repositories as $i => $repo) {
	$repositories[] = adapt_repos($repo, $languages_data[$i]);
}

$data = [
	'bio' => $bio,
	'repositories' => $repositories
];

response($data);
