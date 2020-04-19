<?php 
//error_reporting(E_ALL);
error_reporting(E_USER_ERROR);



$myfile = fopen("config.appfac.js", "r") or die("Unable to open file!");
$f = fread($myfile,filesize("config.appfac.js"));

fclose($myfile);

$htmlJSON = json_decode($f,true); 

function replace_link($path, $p1){
	preg_match('#\{(.*?)\}#', $p1, $match);
	if(count($match)>0){
		$str = $match[1];
		$p2 = preg_replace('/{.*}/U', $path.$str, $p1);
		return $p2;
	}else{
		return $p1;
	}
}

$PATH = "";
$application = $htmlJSON["application"];

$userStatic = false;
if(array_key_exists("use-static", $application)){
	$userStatic = $htmlJSON["application"]["use-static"];
}

$indexAll = $htmlJSON["indexes"]["all"];
$indexConfig = $htmlJSON["indexes"]["index"];

if($userStatic){
	require_once("static-index.html");
}else{
	$doctype = "";

	if(array_key_exists("settings", $indexConfig)){
		if(array_key_exists('path', $indexConfig['settings'])){
			$PATH = $indexConfig['settings']["path"];
		}
	}
	
	if(array_key_exists("doctype", $indexConfig)){
		$doctype = $indexConfig["doctype"];
	}
	if(array_key_exists("doctype", $indexAll)){
		$doctype = $indexAll["doctype"];
	}

	$head = array();
	if(array_key_exists("head", $indexConfig)){
		$head = $indexConfig["head"];
		if(!is_array($head)){
			$head = array();
		}
	}
	if(array_key_exists("head", $indexAll)){
		$head = array_merge($head,$indexAll["head"]);	
	}

	$meta = array();
	if(array_key_exists("meta", $indexConfig)){
		$meta = $indexConfig["meta"];
		if(!is_array($meta)){
			$meta = array();
		}
	}
	if(array_key_exists("meta", $indexAll)){
		$meta = array_merge($meta,$indexAll["meta"]);
	}

	$body = array();
	if(array_key_exists("body", $indexConfig)){
		$body = $indexConfig["body"];
		if(!is_array($body)){
			$body = array();
		}
	}
	if(array_key_exists("body", $indexAll)){
		$body = array_merge($body,$indexAll["body"]);
	}


	$scripts = array();
	if(array_key_exists("scripts", $indexConfig)){
		$scripts = $indexConfig["scripts"];
		if(!is_array($scripts)){
			echo "Nope";
			$scripts = array();
		}
	}
	if(array_key_exists("scripts", $indexAll)){
		$scripts = array_merge($scripts,$indexAll["scripts"]);
	}

	$title = "";
	if(array_key_exists("title", $indexAll)){
		$title = $indexAll["title"];
	}
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
		$html .= replace_link($PATH,$head[$i]);
	}
	$html .= '<title>'. $title .'</title>';
	$html .= '</head>';
	$html .= '<body>';
	for($i=0; $i < count($body); $i++ ){
		$html .= replace_link($PATH,$body[$i]);
	}

	foreach ($scripts as $key => $value) {
		$html .= replace_link($PATH,$scripts[$key]);
	}

	$html .= '</body>';
	$html .= '</html>';

	//ob_clean();
	//ob_end_flush();

	echo $html;
}




?>