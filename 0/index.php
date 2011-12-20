<?php header("Cache-Control: no-cache, must-revalidate"); ?>

<!doctype html>
<html>
<head>
	<title>autocomplete</title>
	<link rel='stylesheet' type='text/css' href='style.css'>
	<script src='script.js'></script>
</head>
<body>
<form id='searchForm' method='get' action=''>
	<input type=hidden id='selectedValue' name='selectedValue' autocomplete='off'>
	<input id='search' type='text'>
</form>
<div id='suggestions'></div>
</body>
</html>