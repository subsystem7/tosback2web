<html>
<head>
<meta charset="utf-8"> 
<style>
.diff-html-added {
	background-color:#DDFF99;
}
.diff-html-removed {
	background-color:#FFDDDD;
	text-decoration:line-through;
}
</style>
</head>
<body>

<?php

// This script uses htmldiff which is a PHP spin off of the daisydiff algorythm for comparing HTML documents
//
// https://gitorious.org/htmldiff
//

include_once "rez/htmldiff-htmldiff/html_diff.php";

$url1 = $_GET["a"]; 
$url2 = $_GET["b"]; 

$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, $url1);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 0);
$page1 = curl_exec($ch);
curl_setopt ($ch, CURLOPT_URL, $url2);
$page2 = curl_exec($ch);
curl_close($ch);

echo html_diff($page1, $page2);

?>


</body>
</html>
