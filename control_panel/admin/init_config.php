<?php

if(file_exists("includes/core/config/master_config.php")){
	header("Location: init_index.php"); 
	exit();
}

if(isset($_POST['dbhost'])){ 


	$failed = false;
	$host = $_POST['dbhost'];
	$name = $_POST['dbname'];
	$user = $_POST['dbuser'];
	$passwd = $_POST['dbpassword'];

	$mysqli = new mysqli($host, $user, $passwd, $name);

	/* check connection */
	if ($mysqli->connect_errno) {
	    printf("Connect failed: %s\n", $mysqli->connect_error);
	    $failed = true;
	    //exit();
	}

	/* check if server is alive */
	if ($mysqli->ping()) {

	    	$myfile = fopen("includes/core/config/master_config.php", "w") or die("Unable to open file!");
		$txt  = "<?php \n";
		$txt .= "define('uieb_dbhost', '".$host."'); \n";
		$txt .= "define('uieb_dbname', '".$name."'); \n";
		$txt .= "define('uieb_dbuser', '".$user."'); \n";
		$txt .= "define('uieb_dbpassword', '".$passwd."'); \n";
		$txt .= "?>";
		fwrite($myfile, $txt);
		fclose($myfile);
		header("Location: init_index.php"); 
		exit();


	} else {
	    printf ("Error: %s\n", $mysqli->error);
	}


	// define(name, value, case-insensitive)
	/* close connection */
	$mysqli->close();

	if($failed==false){
		exit;
	}
	
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" type="text/css" href="../../styles/libs/bootstrap/bootstrap.css">
	<!--<link rel="stylesheet" type="text/css" href="styles/libs/bootstrap/bootstrap-theme.css">-->
	<link rel="stylesheet" type="text/css" href="../../styles/libs/jquery/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="../../styles/libs/jquery/jquery-ui.theme.css">

	<script src="../../js/libs/jquery/dist/jquery.js"></script>
	<link rel="stylesheet" type="text/css" href="../../styles/uieb_styles.css">
	<link rel="stylesheet" type="text/css" href="styles/styles.css">

	<title>Erotass - Administration Dashboard</title>
</head>
<body>

	<div class="container" style="margin-top: 5%;">
		<div class="row">
			<div class="col-md-4 col-md-offset-3">
				<form action="init_config.php" name="my-form" method="POST">
				  <div class="form-group">
				    <label for="exampleInputEmail1">Database Host</label>
				    <input type="text" class="form-control" name="dbhost" id="dbhost" placeholder="Host">
				  </div>
				  <div class="form-group">
				    <label for="exampleInputPassword1">Database Name</label>
				    <input type="text" class="form-control" name="dbname" placeholder="Name">
				  </div>
				  <div class="form-group">
				    <label for="exampleInputEmail1">Database Username</label>
				    <input type="text" class="form-control" name="dbuser" placeholder="Username">
				  </div>
				  <div class="form-group">
				    <label for="exampleInputEmail1">Database Password</label>
				    <input type="text" class="form-control" name="dbpassword" placeholder="Password">
				  </div>
				  <button type="submit" class="btn btn-default">Submit</button>
				</form>
			</div>
		</div>
	</div>
	


	<script type="text/javascript">
		


	</script>

</body>
</html>



