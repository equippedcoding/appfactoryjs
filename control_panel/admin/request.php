<?php  


require 'testing.php';

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}



if(isset($_POST['appfac_testing'])){
	if($appfac_testing==true){
		echo 1;
	}else{
		echo 0;
	}
}

if(isset($_POST['signin'])){

	if($testing==true){
		echo 1;
	}else{
		echo 1;
	}
}



if(isset($_POST['param'])){

	if($_POST['param']=="change_plugin"){

		$pluginDir = $_POST['plugin_dir'];

		$myfile = fopen("../../config.appfac.js", "w") or die("Unable to open file!");
		$txt = $_POST['config'];
		fwrite($myfile, $txt);
		fclose($myfile);

		echo "success";

		$obj1 = "h".generateRandomString();
		$obj2 = "c".generateRandomString();

		$adminThemeName = "default";
		$clientThemeName = "default";

		$clientObj = array("component" => $obj1,
							"directory" => $clientThemeName, 
							"start" => "theme_interface"
						);
		$adminObj = array("component" => $obj2,
					"directory" => $adminThemeName, 
					"start" => "theme_interface"
				);

		$adminObj = (object)$adminObj;
		$clientObj = (object)$clientObj;

		$txt = createInitFile($pluginDir,$adminThemeName,$clientThemeName,$adminObj,$clientObj,$obj1,$obj2);

		echo $pluginDir;


		$myfile = fopen("../../js/plugins/".$pluginDir."/init.js", "w") or die("Unable to open file!");
		fwrite($myfile, $txt);
		fclose($myfile);

		$mainFileText = getMainFileText($pluginDir);

		$myfile = fopen("../../js/main.js", "w") or die("Unable to open file!");
		fwrite($myfile, $mainFileText);
		fclose($myfile);


		echo "success";





	}
	


}



function createInitFile($pluginDir,$adminThemeName,$clientThemeName,$adminObj,$clientObj,$obj1,$obj2){

	$v1 = json_encode($adminObj,JSON_PRETTY_PRINT);
	$v2 = json_encode($clientObj,JSON_PRETTY_PRINT);


	$v3 = str_replace("\"".$obj2."\"",$obj2,$v1);
	$v4 = str_replace('"'.$obj1.'"',$obj1,$v2);

		$de = "";

$de .= "/* This file is auto generated */\n";
$de .= "define([\"appfactory\",\n";
$de .= "	 \"./admin/themes/".$adminThemeName."/theme_interface\"\n";
$de .= "	,\"./client/themes/".$clientThemeName."/theme_interface\"]\n";
$de .= "	,function(appfac,".$adminObj->component.",".$clientObj->component."){\n";

$de .= "		var plugin = {\n";
$de .= "			directory:'".$pluginDir."',\n";
$de .= "			\"admin-themes\": [".$v3."],\n";
$de .= "			\"client-themes\": [".$v4."]\n";
$de .= "		\n};\n\n\n";
$de .= "	RegisterAppFactoryPlugin(plugin);\n\n\n" ;

$de .= "	return plugin;\n\n";

$de .= "});\n\n\n";


return $de;


}




function getMainFileText($plugin){


	$de = "";

$de .= "// This file is auto generated. Any changes will be over written.\n";
$de .= "$.getJSON( \"config.appfac.js\", function( config ) {\n";
$de .= "	require.config(config);\n";
$de .= "	requirejs(['./plugins/".$plugin."/init'],function(activePlugin){\n";
$de .= "		var app = new ApplicationContextManager(config);\n";
$de .= "		app.initializeApplication(true,activePlugin);\n";
$de .= "	});\n";
$de .= "});\n";


return $de;



}



?>











