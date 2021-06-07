<?php
require 'vendor/autoload.php';
use Ddeboer\Imap\Server;

$server = new Server('server.webnetpages.com','993','/ssl/novalidate-cert');

// $connection is instance of \Ddeboer\Imap\Connection
$connection = $server->authenticate('joseph@webnetpages.com', 'joseph99');


$mailbox = $connection->getMailbox('INBOX');

$messages = $mailbox->getMessages();

$msg = "";

foreach ($messages as $message) {
    $msg = $message->getFrom() ." - ". $message->getTo(). " - " . $message->getSubject();
}

print_r($msg)

