<?php
session_start();

/*
* Database config data. This is set during initial
* setup of the application. This file can be modified
* 
*/
require_once 'config/master_config.php';



/*
*** FILE TO BE INLCUDING IN ALL PHP SCRIPTS ***
*
* This is the initial script for all php files to follow
* To except mulitiple DB connection just add another config
* with in the array. Calling DB::getInstance() without a 
* param uses the default mysql config to get a specific DB
* specify the key as the param for DB::getInstance('key');
* and that will return that DB connection. 
*
*
*
*/
$GLOBALS['config'] = array(
	'mysql' => array(
		'host' => uieb_dbhost,//'localhost',
		'username' => uieb_dbuser,//'erotass',
		'password' => uieb_dbpassword,//'kgjkjf495ndk999',
		'db' => uieb_dbname//'erotassdb'
	),
	'remember' => array(
		'cookie_name' => 'hash',
		'cookie_expiry' => 604800 // cookie expires in seconds
	),
	'session' => array(
		'session_name' => 'user',
		'token_name' => 'token'
	)

);

spl_autoload_register(function($class){
	$sources = array('/classes/' . $class . '.php', "/myclasses/".$class.".php");

    //foreach ($sources as $source) {
	for($i=0; $i<count($sources); $i++){
    	//echo __DIR__ . $sources[$i]."\n";
        if (file_exists(__DIR__ . $sources[$i])) {
        	//echo "EXITS\n";
            require_once __DIR__ . $sources[$i]; 
        } 
    } 
});

require_once 'functions/sanitize.php';


if(Cookie::exists(Config::get('remember/cookie_name')) && !Session::exists(Config::get('session/session_name'))){

	$hash = Cookie::get(Config::get('remember/cookie_name'));
	$hashCheck = DB::getInstance()->get('users_sessions', array('hash', '=', $hash));

	if($hashCheck->count()){
		$user = new User($hashCheck->first()->user_id);
		$user->login();
	}
}







?>