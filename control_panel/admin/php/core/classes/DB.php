<?php

class DB{

	private static $_instance = null;
	private static $_instances = array();
	private $_pdo, 
			$_query, 
			$_error = false, 
			$results, 
			$_count = 0;

			

	private function __construct($dbConfig = null){
		try{
			if($dbConfig==null){
				$this->_pdo = new PDO('mysql:host=' . Config::get('mysql/host') . ';dbname=' .Config::get('mysql/db'), Config::get('mysql/username'), Config::get('mysql/password'));

				$this->_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    		$this->_pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			}else{
				$this->_pdo = new PDO('mysql:host=' . Config::get($dbConfig.'/host') . ';dbname=' .Config::get($dbConfig.'/db'), Config::get($dbConfig.'/username'), Config::get($dbConfig.'/password'));

				$this->_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	    		$this->_pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			}
			
			//echo "Connected\n";
		}catch(PDOException $e){
			die($e->getMessage());
		}
	}

	public static function getInstance($dbConfig = null){
		$instance = null;
		//if(!isset(self::$_instances)){
			if($dbConfig==null){
				if(array_key_exists( 'default' , self::$_instances )){
					$instance = self::$_instances['default'];
				}else{
					$instance = new DB();
					self::$_instances['default'] = $instance;
				}
			}else{
				if(array_key_exists( $dbConfig , self::$_instances )){
					$instance = self::$_instances[$dbConfig];
				}else{
					$instance = new DB($dbConfig);
					self::$_instances[$dbConfig] = $instance;
				}
			}
		//}
		return $instance;
	}

	/*
	public static function getInstance(){
		if(!isset(self::$_instance)){
			self::$_instance = new DB();
		}
		return self::$_instance;
	}
	*/


	public function query($sql, $params = array()){
		$this->_error = false;
		if($this->_query = $this->_pdo->prepare($sql)){
			$x = 1;
			if(count($params)){
				foreach($params as $param){
					$this->_query->bindValue($x, $param);
					$x++;
				}
			}

			try{
				if($this->_query->execute()){
					$this->_results = $this->_query->fetchAll(PDO::FETCH_OBJ);
					$this->_count = $this->_query->rowCount();
				}else{
					$this->_error = true;
				}
			}catch(Exception $e){
				$this->_error = true;
				var_dump($e->getMessage());
			}

		}
		return $this;
	}


	public function action($action,$table,$where=array()){
		if(count($where) === 3){
			$operators = array('=','>','<','>=','<=');

			$field = $where[0];
			$operator = $where[1];
			$value = $where[2];

			if(in_array($operator, $operators)){
				$sql = "{$action} FROM {$table} WHERE {$field} {$operator} ?"; 
				if($this->query($sql, array($value))->error()){
					return $this;
				}
			}
		}
		return $this;
	}
	public function get($table, $where){
		return $this->action('SELECT *', $table, $where);
	}
	public function delete($table, $where){
		return $this->action('DELETE', $table, $where);
	}

	public function insert($table, $fields = array()){
		if(count($fields)){
			$keys = array_keys($fields);
			$values = '';
			$x = 1;

			foreach($fields as $field){
				$values .= '?';
				if($x < count($fields)){
					$values .= ', ';
				}
				$x++;
			}

			$sql = "INSERT INTO " . $table . " ( `" . implode('`,`', $keys). "` ) VALUES ({$values})";

			if(!$this->query($sql, $fields)->error()){
				return true;
			}

			//echo $sql;
		}
		return false;
	}

	public function update($table, $id, $fields){
		$set = '';
		$x = 1;

		foreach($fields as $name => $value){
			$set .= "{$name} = ?";
			if($x < count($fields)){
				$set .= ', ';
			}
			$x++;
		}

		$sql = "UPDATE {$table} SET {$set} WHERE id = {$id}";

		if(!$this->query($sql, $fields)->error()){
			return true;
		}
		return false;
	}


	/*
		array(
			'' => ''
		)

	*/
	public function updateFields($table, $fields, $where = array()){
		$set = '';
		$x = 1;

		foreach($fields as $name => $value){
			$set .= "{$name} = ?";
			if($x < count($fields)){
				$set .= ', ';
			}
			$x++;
		}

		$w = '';
		$c = 1;
		foreach ($where as $key => $value) {
			//print_r($value);
			$k = explode(" ",$value);
			if($c==1){
				$w = $w . '' . $key . ' ' . $k[0] . '\'' . $k[1] . '\''; 
			}else{
				$w = $w . ' AND ' . $key . ' ' . $k[0] . '\'' . $k[1] . '\''; 
			}
			$c++;
			
		}

		$sql = "UPDATE {$table} SET {$set} WHERE {$w}";

		print_r($sql);
		
		if(!$this->query($sql, $fields)->error()){
			return true;
		}
		
		return $sql;
	}

	public function results(){
		return $this->_results;
	}

	public function count(){
		return $this->_count;
	}

	public function first(){
		return $this->results()[0];
	}

	public function error(){
		return $this->_error;
	}





	// application/json
	public function insertBlob($filePath, $mime) {
        $blob = fopen($filePath, 'rb');
 
        $sql = "INSERT INTO files(mime,data) VALUES(:mime,:data)";
        $stmt = $this->_pdo->prepare($sql);
 
        $stmt->bindParam(':mime', $mime);
        $stmt->bindParam(':data', $blob, PDO::PARAM_LOB);
 
        return $stmt->execute();
    }
    public function selectBlob($id) {
 
        $sql = "SELECT mime, data FROM files WHERE id = :id;";
 
        $stmt = $this->_pdo->prepare($sql);
        $stmt->execute(array(":id" => $id));
        $stmt->bindColumn(1, $mime);
        $stmt->bindColumn(2, $data, PDO::PARAM_LOB);
 
        $stmt->fetch(PDO::FETCH_BOUND);
 
        return array("mime" => $mime,
            "data" => $data);
    }






}



?>






