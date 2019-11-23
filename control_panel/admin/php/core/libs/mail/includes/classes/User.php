<?php 
class User {

	private $_db,
			$_data,
			$_sessionName,
			$_sessionId,
			$_cookieName,
			$_isLoggedIn = false,
			$_username = '';

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
		if(!$this->_db->insert('users', $fields)){
			throw new Exception("Error Processing Request", 1);
		}
	}


	public function find($user = null){
		if($user){
			$field = (is_numeric($user)) ? 'id' : 'username';
			$data = $this->_db->get('users', array($field, '=', $user));

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
		}else{

			$user = $this->find($username);

			if($user){
				//if($this->data()->password === Hash::make($password, $this->data()->salt)){
				if($this->data()->password === $password){
					Session::put($this->_sessionName, $this->data()->id);

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

		$this->_db->delete('users_sessions', array('user_id', '=', $this->data()->id));
	}


	public function isLoggedIn(){
		$logged = false;
		$islogged = Session::get($this->_sessionName);
		if($islogged!=false){
			$logged = true;
		}
		return $logged;//$this->_isLoggedIn;
	}

	public function exists(){
		return (!empty($this->_data)) ? true : false;
	}



}


?>