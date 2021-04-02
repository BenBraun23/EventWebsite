const express = require("express");
const PORT = 3000;
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser')
var con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"databasepassword",
	database:"eventwebsite"
});

con.connect(function(err){
	if(err) throw err;
	console.log("Connected!");
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {  
    res.setHeader('Access-Control-Allow-Origin', '*');  
    res.setHeader('Access-Control-Allow-Headers',    
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');  
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');  
    next();
});

app.get("/hello", function(request, response) {
	response.send("Hello World!");
});

app.post('/api/login', (req, res, next) => {
    const {login, password} = req.body;
    con.query('SELECT * FROM users WHERE login="' + login + '" AND password="' + password + '"',
	function(error, results, fields) {
		if(error)
		{
			return res.status(500).json({error: "unkown error"});
		}
		if(!results)
		{
			return res.status(200).json({error: "login or password is incorrect"});
		}
		return res.status(200).json({error: "", id: results.id});
	});

});

app.post('/api/register', async (req, res, next) => {
    const {login, password, role} = req.body;
	var error = '';
    await con.query('SELECT * FROM users WHERE login="' + login + '" AND password="' + password + '"', 
		function(error, results, fields) {
			if(error)
			{
				error = 'unknown error';
			}
			else if(results)
			{
				error = 'the username is already taken';
			}
	});
	if(!error)
	{
		await con.query('INSERT INTO users (login, password, role) VALUES ("' + login + '","' + password + '", "' + role + '");',
		function(error, results, fields) {
			
			if(error)
			{
				error = 'unkown error';
			}
		});
	}
    return res.status(200).json({error: error});
    
});
app.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
});
