const express = require("express");
const PORT = 5000;
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser');
const json = require("body-parser/lib/types/json");
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

app.post('/api/login', async (req, res, next) => {
	console.log("login");
    const {email, password} = req.body;
	const sql = 'SELECT * FROM users WHERE email="' + email + '" AND password="' + password + '";';
	console.log(sql);
	await con.query(sql,
		function(error, results, fields) {
			if(error)
			{
				return res.status(500).json({error: "unkown error"});
			}
			if(results.length == 0)
			{
				return res.status(200).json({error: "login or password is incorrect"});
			}
			console.log(results);
			return res.status(200).json({error: "", id: results[0].id});
		}
	);

});

app.post('/api/register', (req, res, next) => {
	console.log("register");
    const {email, password} = req.body;
	var err = '';
    con.query('SELECT * FROM users WHERE email="' + email + '";', 
		function(error, results, fields) {
			console.log(results);
			if(error)
			{
				err = 'unknown error';
			}
			else if(results.length > 0)
			{
				console.log('username takennnn');
				err = 'the username is already taken';
			}
			else 
			{
				con.query('INSERT INTO users (email, password) VALUES ("' + email + '","' + password + '");',
				function(error, results, fields) {
					if(error)
					{
						err = 'unkown error';
					}
					return res.json({error: err});
				});
			}
			return res.json({error: err});
	});
    
});

app.post('/api/addcomment', async(req, res, next) => {
	console.log("add");
	const {text, rating} = req.body;
	var err = '';
	var id = -1;
	var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	await con.query('INSERT INTO comments (text, rating, time) VALUES ("' + text + '", "' + rating + '", "' + date + '");',
		function(error, result, fields) {
			if(error)
			{
				console.log("error");
				err = 'unkown error';
			}
			else 
			{
				id = result.insertId;
			}
			return res.json({error: err, id: id});
		}
	);
});

app.post('/api/editcomment', async (req, res, next) => {
	const {id, text, rating} = req.body;
	var err = '';
	await con.query('UPDATE comments SET text="' + text + '", rating="' + rating + '" WHERE id=' + id + ';',
		function(error, results, fields) {
			if(error)
			{
				err = 'unkown error';
			}
		}
	);
	return res.json({error: err});
});

app.post('/api/deletecomment', async (req, res, next) => {
	const {id} = req.body;
	var err = '';
	await con.query('DELETE FROM comments WHERE id=' + id,
		function(error, results, fields) {
			if(error)
			{
				console.log(error);
				err = 'unkown error';
			}
			return res.json({error: err});
		}
	);
});

app.post('/api/addlocation', async(req, res, next) => {
	const {name, address, longitude, latitude} = req.body;
	var err = '';
	await con.query('SELECT * FROM locations WHERE lname="' + name + '";', function(error, result, fields){
		if(error)
		{
			console.log("error " + error);
			err='unknown error';
		}
		else if(result.length > 0)
		{
			err='the location already exists';
		}
		else 
		{
			con.query('INSERT INTO locations (lname, address, longitude, latitude) VALUES ("' + name + '", "' + address + '", "' + longitude + '","' + latitude +'");',
			function(error, result, fields) {
				if(error)
				{
					err = 'unkown error';
				}
			});
		}
		return res.json({error: err});
	});
});
app.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
});
