<?php header("Cache-Control: no-cache, must-revalidate"); ?>

<!doctype html>
<html>
<head>
	<title>autocomplete</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<form id="searchForm" method="get" action="">
	<input type=hidden id="selectedValue" name="selectedValue">
	<input id="search" type="text" autocomplete="off">
</form>
<div id="suggestions"></div>
<script src="script.js"></script>
</body>
</html>