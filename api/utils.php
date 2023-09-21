<?php

function response($data, $ok = true) {
	$data['ok'] = $ok;

	exit(json_encode($data, JSON_UNESCAPED_UNICODE));
}

function fetch($url, $headers) {
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$response = curl_exec($ch);

	curl_close($ch);

	return $response;
}

function multifetch($urls, $headers) {
	$mh = curl_multi_init();
	$chs = [];

	foreach ($urls as $url) {
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$chs[] = $ch;
    curl_multi_add_handle($mh, $ch);
	}

	$running = null;
	do {
		curl_multi_exec($mh, $running);
	} while ($running);

	$responses = [];
	foreach ($chs as $ch) {
		$responses[] = curl_multi_getcontent($ch);
		curl_multi_remove_handle($mh, $ch);
	}
	curl_multi_close($mh);

	return $responses;
}
