<!DOCTYPE html>
<html>
<head>


	<meta http-equiv=X-UA-Compatible" content="IE=edge">

	<meta charset="ISO-8859-1">
	<meta http-equiv=X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1"> <!-- width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0    </meta> minimum-scale=1, maximum-scale=1"> -->
		<!-- Libraries -->
	<link rel="stylesheet" type="text/css" href="styles/libs/bootstrap/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/bootstrap/bootstrap-theme.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/jquery/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="styles/libs/jquery/jquery-ui.theme.css">
		
	<link href="https://fonts.googleapis.com/css?family=Indie+Flower|Katibeh" rel="stylesheet">
		
	<script src="js/libs/jquery/jquery-1.12.js"></script>
	<script src="js/libs/jquery/jquery-ui.js"></script>
	<script src="js/libs/raphael/raphael.js"></script>
		
	<script src="js/libs/bootstrap/bootstrap.js"></script>
		
	<script src="js/libs/backbone/underscore.js"></script>
	<script src="js/libs/backbone/backbone.js"></script> 
		
	<script src="js/libs/support/support.js"></script> 
		
	<!-- CSS Styles -->
	<!-- <link rel="stylesheet" type="text/css" href="styles/styles.css"> 
	<link rel="stylesheet" type="text/css" href="styles/apple-styles.css"> -->
	<link rel="stylesheet" type="text/css" href="styles/styles.css">
	<title>WebnetPages</title>
</head>
<body>
<script type="text/javascript">
	var ECApplication = {};
	var PRODUCTION = true;
	var SSL = false;
	function URL_ROUTE(route){
		var PROD_URL = '', DEV_URL = '';
		if(PRODUCTION){
			var cur = document.location.href;
			if(cur.includes("www")){
				return PROD_URL = route;//"http://www.shaundrasimmonsfoundation.org/" + route;
			}else{
				return PROD_URL = route;//"http://shaundrasimmonsfoundation.com/" + route;
			}
			
			
		}else{
			if(SSL){
				DEV_URL = "http://localhost:8181/2wokegurls/" + route;
			}else{
				DEV_URL = "http://localhost:8080/2wokegurls/" + route;
			}
			return DEV_URL;
		}
	}
</script>


