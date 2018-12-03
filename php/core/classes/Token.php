<?php
class Token {

	public static function generate(){
		$t = Session::put(Config::get('session/token_name'), md5(uniqid()));
		return $t;
	}

	public static function check($token){
		$tokenName = Config::get('session/token_name');

		if(Session::exists($tokenName) && trim($token) === trim(Session::get($tokenName))){
			Session::delete($tokenName);
			return true;
		}
		return false;
	}
}



?>