<?php
class User {

	private $_db,
			$_data,
			$_sessionName,
			$_sessionId,
			$_cookieName,
			$_isLoggedIn = false,
			$_username = '',
			$_inActivity = 43200; // 12 hours

	public function __construct($user = null){
		$this->_db = DB::getInstance();
		$this->_sessionName = Config::get('session/session_name');
		$this->_cookieName = Config::get('remember/cookie_name');

		if(!$user){
			if(Session::exists($this->_sessionName)){
				$user = Session::get($this->_sessionName);

				if($this->find($user)){
					$this->_isLoggedIn = true;
				}else{
					// process logout
				}
			}
		}else{
			$this->find($user);
		}






	}

	public function getUsername(){
		if(Session::exists($this->_sessionName)){
			$user = Session::get($this->_sessionName);

			if($this->find($user)){
				$this->_isLoggedIn = true;
				return $this->data()->username;
			}
		}
		return '';
	}

	public function create($fields = array()){
		if(!$this->_db->insert('control_dash_users', $fields)){
			throw new Exception("Error Processing Request", 1);
		}
	}


	public function find($user = null){
		if($user){
			$field = (is_numeric($user)) ? 'id' : 'username';
			$data = $this->_db->get('control_dash_users', array($field, '=', $user));

			if($data->count()){
				$this->_data = $data->first();
				return true;
			}
		}
		return false;
	}

	public function login($username = null, $password = null, $remember = false){


		if(!$username && !$password && $this->exists()){
			Session::put($this->_sessionName, $username."#".$this->data()->id);
			$_SESSION['timestamp'] = time();
		}else{

			$user = $this->find($username);

			if($user){
				//if($this->data()->password === Hash::make($password, $this->data()->salt)){
				if($this->data()->password === $password){
					Session::put($this->_sessionName, $this->data()->id);
					$_SESSION['timestamp'] = time();

					if($remember){

						$hash = Hash::unique();
						$hashCheck = $this->_db->get('users_sessions', array('user_id', '=', $this->data()->id));

						if(!$hashCheck->count()){
							$this->_db->insert('users_sessions', array(
								'user_id' => $this->data()->id,
								'hash' => $hash
							));
						}else{
							$hash = $hashCheck->first()->hash;
						}

						//echo "Cookie set";

						Cookie::put($this->_cookieName, $hash, Config::get('remember/cookie_expiry'));
					}


					return true;
				}
			}

		}
		return false;
	}




	public function data(){
		return $this->_data;
	}

	public function logout(){
		Session::delete($this->_sessionName);
		Cookie::delete($this->_cookieName);
		unset($_SESSION['timestamp']);

		//$this->_db->delete('users_sessions', array('user_id', '=', $this->data()->id));
	}


	public function isLoggedIn(){
		$logged = false;
		$islogged = Session::get($this->_sessionName);
		if($islogged!=false){
			$_active_ = $this->returnCheckActivity();
			if($_active_){
				$logged = true;
			}else{
				$logged = false;
			}
		}
		return $logged;//$this->_isLoggedIn;
	}

	public function exists(){
		return (!empty($this->_data)) ? true : false;
	}


	public function returnCheckActivity(){
		if(isset($_SESSION['timestamp'])){
			if(time() - $_SESSION['timestamp'] > $this->_inActivity) {
				return false;
			} else {
				 $_SESSION['timestamp'] = time(); //set new timestamp
				 return true;
			}
		}else{
			return false;
		}
	}

	public function checkActivity($callback=null){
		if(isset($_SESSION['timestamp'])){
			$this->_checkActivity($callback);
		}else{
			if($callback!=null){
				$callback(false);
			}
		}
	}

	private function _checkActivity($callback=null){
		if(time() - $_SESSION['timestamp'] > $this->_inActivity) { //subtract new timestamp from the old one
			if($callback!=null){
				$callback(true);
			}

			 //echo"<script>alert('15 Minutes over!');</script>";
			 //unset($_SESSION['username'], $_SESSION['password'], $_SESSION['timestamp']);
			 //$_SESSION['logged_in'] = false;
			 //header("Location: " . index.php); //redirect to index.php
			// exit;
		} else {
			 $_SESSION['timestamp'] = time(); //set new timestamp
			 $this->logout();
			 if($callback!=null){
 				$callback(false);
 			 }
		}

	}




}


?>
