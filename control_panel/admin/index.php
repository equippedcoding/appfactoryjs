<?php
if(!file_exists("includes/core/config/master_config.php")){
	header("Location: init_config.php"); 
	exit();
}
require_once "includes/core/init.php";
?>


