<?php 

$myfile = fopen("config.appfac.js", "r") or die("Unable to open file!");
$f = fread($myfile,filesize("config.appfac.js"));

fclose($myfile);

$htmlJSON = json_decode($f,true);


$application = $htmlJSON["application"];
$userStatic = false;
if(array_key_exists("use-static", $application)){
	$userStatic = $htmlJSON["application"]["use-static"];
}

$indexConfig = $htmlJSON["index-config"];

if($userStatic){
	require_once("static-index.html");
	echo "useing static";
}else{
	$doctype = "";

	if(array_key_exists("doctype", $indexConfig)){
		$doctype = $indexConfig["doctype"];
	}

	$head = array();
	if(array_key_exists("head", $indexConfig)){
		$head = $indexConfig["head"];
		if(!is_array($head)){
			$head = array();
		}
	}

	$meta = array();
	if(array_key_exists("meta", $indexConfig)){
		$meta = $indexConfig["meta"];
		if(!is_array($meta)){
			$meta = array();
		}
	}

	$body = array();
	if(array_key_exists("body", $indexConfig)){
		$body = $indexConfig["body"];
		if(!is_array($body)){
			$body = array();
		}
	}

	$scripts = array();
	if(array_key_exists("scripts", $indexConfig)){
		$scripts = $indexConfig["scripts"];
		if(!is_array($scripts)){
			echo "Nope";
			$scripts = array();
		}
	}

	$title = "";
	if(array_key_exists("title", $indexConfig)){
		$title = $indexConfig["title"];
	}

	$html = '';
	$html .= $doctype;
	$html .= '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">';
	$html .= '<head>';
	for($i=0; $i < count($meta); $i++ ){
		$html .= $meta[$i];
	}
	for($i=0; $i < count($head); $i++ ){
		$html .= $head[$i];
	}
	$html .= '<title>'. $title .'</title>';
	$html .= '</head>';
	$html .= '<body>';
	for($i=0; $i < count($body); $i++ ){
		$html .= $body[$i];
	}

	foreach ($scripts as $key => $value) {
		$html .= $scripts[$key];
	}

	$html .= '</body>';
	$html .= '</html>';


	echo $html;
}




?>