<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once('utils.php');

$routes = ['/portfolio'];

$route = $_SERVER['REQUEST_URI'];
if ($route[strlen($route) - 1] === '/') {
	$route = substr($route, 0, -1);
}

if (in_array($route, $routes)) {
	require_once('routes' . $route . '.php');
} else {
	http_response_code(404);
	response(['error' => 'No endpoint ' . $_SERVER['REQUEST_URI']], false);
}
