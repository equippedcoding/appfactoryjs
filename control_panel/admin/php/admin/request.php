<?php
require_once '../core/init.php';


/* GET */
if(Input::exists('get')){
} // END OF GET

 


/* POST */
if(Input::exists('post')){


	if(Input::get('login')!=''){ login(); }



	




} // END OF POST



if(Input::get('testing')!=''){

	echo 'the world is mine';

}



function login(){
	$user = new User();
	$username = Input::get("username");
	$password = Input::get("password");

	$logIn = $user->login($username,$password);

	if($logIn){
		echo "success";
	}else{
		echo "failure";
	}
}






?>
