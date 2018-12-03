<?php
include_once 'vendor/autoload.php';

$gateway = new Braintree_Gateway(array(
    'accessToken' => 'access_token$sandbox$d7grf2sgyq3hrm9f$602cec363151edf8741441e1f5516b5b',
));


if(isset($_POST['token_request'])){
	echo($clientToken = $gateway->clientToken()->generate());
}


if(isset($_POST["payment_method_nonce"])){
	$result = $gateway->transaction()->sale([
	    "amount" => $_POST['amount'],
	    'merchantAccountId' => 'USD',
	    "paymentMethodNonce" => $_POST['payment_method_nonce'],
	    //"orderId" => $_POST['Mapped to PayPal Invoice Number'],
	    /*
	    "descriptor" => [
	      "name" => "cmpproductdescription"//"Descriptor displayed in customer CC statements. 22 char max"
	    ],
	    
	    "shipping" => [
	      "firstName" => "Jen",
	      "lastName" => "Smith",
	      "company" => "Braintree",
	      "streetAddress" => "1 E 1st St",
	      "extendedAddress" => "Suite 403",
	      "locality" => "Bartlett",
	      "region" => "IL",
	      "postalCode" => "60103",
	      "countryCodeAlpha2" => "US"
	    ],
	    */
	    "options" => [
	      "paypal" => [
	        //"customField" => $_POST["PayPal custom field"],
	        //"description" => $_POST["Description for PayPal email receipt"]
	      ],
	    ]
	]);
	/*
	if ($result->success) {
		  print_r("Success ID: " . $result->transaction->id);
	} else {
		  print_r("Error Message: " . $result->message);
	}
	*/
	
	$_response = '';
	if ($result->success) {
		  $_response = "success";//"Success ID: " . $result->transaction->id;
	} else {
		  $_response = "failure";//"Error Message: " . $result->message;
	}
	echo $_response;
	
}




?>
