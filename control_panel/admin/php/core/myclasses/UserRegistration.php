<?php
class UserRegistration {



	private $_fields;




	public function __construct(){  
		$db = $this->_db = DB::getInstance();
		$result = $db->query("SELECT registration FROM uieb_standard");
		if($db->count()==0){
			$query = "INSERT INTO uieb_standard (registration,status,content,features) VALUES ('{}','{}','{}','{}')";
			$db->query($query);

			$this->_fields = json_decode("{}");
		}else{
			$this->_fields = json_decode($db->first()->registration);

			//echo json_last_error() ."\n";

			//echo gettype($this->_fields); 
			//echo $db->first()->registration . "\n";
			//echo json_encode($this->_fields) . "\n";
		}
	}

	public function addField($fieldId,$field){

		//echo json_encode($this->_fields) . "\n";
		$this->_fields->$fieldId = json_decode($field);
		//echo json_encode($this->_fields) . "\n";
	}

	public function removeField($fieldId){

	}

	public function save(){
		$db = $this->_db = DB::getInstance();
		$f = json_encode($this->_fields);
		$result = $db->query("UPDATE uieb_standard SET registration='".$f."'");
	}


	public function fields(){  
		return $this->_fields;
	}


















	public function getStatus($gender,$age,$location){
		if($this->_status==null || count($this->_status)==0){
			return "{\"status\":0,\"start\":\"onCreate\",\"end\":-1,\"fallback_status\":0,\"amount\":0,\"subscription\":false,\"effected\":\"all\"}";
		}else{
			$status = "";
			$statusAll = "";
			for($i=0; $i<count($this->_dat_status_set); $i++){
				if($this->_status[$i]->effected=="all"){
					$statusAll = $this->_status[$i];
				}
			}

		}

	
	}




}



?>