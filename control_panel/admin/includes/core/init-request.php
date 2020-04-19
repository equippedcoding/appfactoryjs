<?php
require_once 'init.php';

  

if(Input::get('retrieve-all-data')!=''){}

if(Input::get('update_features')!=''){ update_features(); }

if(Input::get('get_data_set')!=''){ get_data_set(); }

if(Input::get('get_all_data_set')!=''){ get_all_data_set(); }
if(Input::get('retrieve-all-data')!=''){ get_all_data_set(); }

if(Input::get('get_all_users')!=''){ get_all_users(); }

if(Input::get('update_data_file_loc')!=''){update_data_file_loc();}

if(Input::get('retrieve_data_file')!=''){retrieve_data_file();}


  

if(Input::get('data_retrieval')!=''){
	
	$userRegistration = new UserRegistration();


	$data = array(
		'registration' => $userRegistration->fields(),
	);

	echo json_encode($data); 
}
if(Input::get('registration_field')!=''){
	$field_name_id = Input::get('field_name_id');
	$field = Input::get('field');
	$userRegistration = new UserRegistration();
	$userRegistration->addField($field_name_id,$field);
	$userRegistration->save();
	echo json_encode($userRegistration->fields());
}
if(Input::get('get_registration_field')!=''){
	$userRegistration = new UserRegistration();
	echo json_encode($userRegistration->fields());
}
if(Input::get('check-unique')!=''){
	$con = mysqli_connect(uieb_dbhost,uieb_dbuser,uieb_dbpassword,uieb_dbname);
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM uieb_users WHERE ".Input::get('field_name_id')." = '".Input::get('check-unique')."'";
	$result = mysqli_query($con, $sql);
	$unique = true;
	if (mysqli_num_rows($result) > 0) {
		$unique = false;
	    	//while($row = mysqli_fetch_assoc($result)) {}
	}

	if($unique==false){
		echo "false";
	}else{
		echo "true";
	}
}







































































































function get_all_data_set(){

	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM admin2";
	$result = mysqli_query($con, $sql);
	$data_set = array();
	if (mysqli_num_rows($result) > 0) {
	    while($row = mysqli_fetch_assoc($result)) {
	    	$data_set = $row['data_set'];
				echo $data_set;
	    }
	}else {
		echo json_encode( $data_set );
	}

	mysqli_close($con);



}
function get_data_set(){
	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM admin2";
	$result = mysqli_query($con, $sql);

	$data_set_id = Input::get('get_data_set');

	$data_set = array();
	$data_set_array = array();
	if (mysqli_num_rows($result) > 0) {
	    while($row = mysqli_fetch_assoc($result)) {
	    	$array = json_decode($row['data_set']);
		    foreach ($array as $key => $jsons) {

		    	if($key==$data_set_id){
		    		$data_set_array = $jsons;
		    	}
		    	/*
	     		foreach($jsons as $key => $value) {
	         		echo $value; // This will show jsut the value f each key like "var1" will print 9
	                       // And then goes print 16,16,8 ...
	    		}
	    		*/
			}
	    }
	}

	mysqli_close($con);

	echo json_encode($data_set_array);
}

function update_features(){

	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM admin2";
	$result = mysqli_query($con, $sql);

	$data_set = null;
	if (mysqli_num_rows($result) > 0) {
	    while($row = mysqli_fetch_assoc($result)) {
	    	$data_set = $row['data_set'];
	    }
	}else{
		mysqli_query($con, "INSERT INTO admin2 (data_set) VALUES ('NULL')");
	}

	$feature_id = Input::get("feature_id");
	$feature_data = json_decode(Input::get("feature_data"));



	if($data_set==null){
		$data_set = array();
		$data_set[$feature_id] = $feature_data;
	}else{
		$data_set = json_decode($data_set);
		$data_set->$feature_id = $feature_data;
	}


	$sql1 = "UPDATE admin2 SET data_set='".json_encode($data_set)."'";
	$result1 = mysqli_query($con, $sql1) or die(mysqli_error($con));;

	mysqli_close($con);

	echo json_encode($data_set);
}



function get_all_users(){

	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM users LIMIT 50";
	$result = mysqli_query($con, $sql);

	$users = array();
	if (mysqli_num_rows($result) > 0) {
	    while($row = mysqli_fetch_assoc($result)) {

	    	$user = array(
	    		'username' => $row['username'],
				'password' => $row['password'],
				'level' => $row['level'],
				'firstname' => $row['firstname'],
				'lastname' => $row['lastname'],
				'email' => $row['email'],
				'gender' => $row['gender'],
				'lang' => $row['lang'],
				'active' => $row['active'],
				'address' => $row['address'],
				'city' => $row['city'],
				'dob' => $row['dob'],
				'state' => $row['state'],
				'zipcode' => $row['zipcode'],
				'dum' => $row['dum'],
				'country' => $row['country'],
				'phonenumber' => $row['phonenumber'],
				'date' => $row['date']
	    	);
	    	$users[count($users)] = $user;
	    }
	}

	mysqli_close($con);

	echo json_encode($users);



}



function get_features(){
	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT * FROM users LIMIT 50";
	$result = mysqli_query($con, $sql);

	$users = array();
	if (mysqli_num_rows($result) > 0) {
	    while($row = mysqli_fetch_assoc($result)) {

	    }
	}

	mysqli_close($con);

	echo json_encode($users);



}


function retrieve_data_file(){
	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "SELECT data_file FROM admin2";
	$result = mysqli_query($con, $sql) or die(mysqli_error($con));

	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			echo $row['data_file'];
		}
	}
}
function update_data_file_loc(){
	$con = mysqli_connect("localhost","root","goodnews84","erotassdb");
	//$friend = mysqli_real_escape_string($con,Input::get('search_friends'));
	$sql = "UPDATE admin2 SET data_file='".Input::get('update_data_file_loc')."'";


	$result = mysqli_query($con, $sql) or die(mysqli_error($con));
}




?>