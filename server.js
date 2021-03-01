const express = require("express");
const PORT = 3000;
const mysql = require("mysql");

var con = mysql.createConnection({
	host:"localhost",
	user:"EventWebsite",
	password:"EventWebsite1!"
});

con.connect(function(err){
	if(err) throw err;
	console.log("Connected!");
});

const app = express();

app.get("/", function(request, response) {
	response.send("Hello World!");
});

app.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
});
