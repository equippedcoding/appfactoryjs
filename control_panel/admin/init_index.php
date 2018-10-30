<?php

if(!file_exists("includes/core/config/master_config.php")){
	header("Location: init_config.php"); 
	exit();
}

require_once "includes/core/init.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" type="text/css" href="../../styles/libs/bootstrap/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="../../js/libs/jqueryui/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="../../styles/libs/fakeloader/fakeLoader.css">
	<link rel="stylesheet" type="text/css" href="../../js/libs/support/uieb/uieb_styles.css">
	<link rel="stylesheet" type="text/css" href="styles/styles.css">
	<!-- <script src="https://cdn.WebRTC-Experiment.com/RecordRTC.js"></script> -->
	<title>Administration Dashboard</title>
</head>
<body>


	<script data-main="js/main.js" src="../../js/libs/requirejs/require.js"></script>
</body>
</html>





