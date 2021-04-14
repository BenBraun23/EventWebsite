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
	return executeQuery(sql, 
		function(error, results) {
			if(results.length == 0)
			{
				error = 'login or password is incorrect';
			}
			if(error)
			{
				return res.json({error: error});
			}
			return res.json({error: error, id: results[0].id});
		});
});


app.post('/api/register', async (req, res, next) => {
	console.log("register");
    const {email, password} = req.body;
	console.log(email);
	return executeQuery('SELECT * FROM users WHERE email="' + email + '";', 
		function(error, results) {
			console.log(error);
			console.log(results);
			if(results.length > 0)
			{
				error = 'the username is already taken';
			}
			if(error)
			{
				return res.json({error: error});
			}
			return executeQuery('INSERT INTO users (email, password) VALUES ("' + email + '","' + password + '");',
				function(error, results){
					return res.json({error: error});
			});
	});
});

app.post('/api/registerAdmin', async (req, res, next) => {
    const {email, password, university} = req.body;
	return executeQuery('SELECT * FROM users WHERE email="' + email + '";', 
		function(error, results) {
			if(results.length > 0)
			{
				error = 'the username is already taken';
			}
			if(error)
			{
				return res.json({error: error});
			}
			return executeQuery('INSERT INTO users (email, password) VALUES ("' + email + '","' + password + '");',
				function(error, results){
					if(results)
					{
						var query = 'INSERT INTO admins (aid, university) VALUES ("' + results.insertId + '","' + university + '");'
						return executeQuery(query,
							function(error, results) {
								return res.json({error: error});
						})
					}
					return res.json({error: error});
			});
	});
});
app.post('/api/registerSuperadmin', async (req, res, next) => {
    const {email, password} = req.body;
	return executeQuery('SELECT * FROM users WHERE email="' + email + '";', 
		function(error, results) {
			if(results.length > 0)
			{
				error = 'the username is already taken';
			}
			if(error)
			{
				return res.json({error: error});
			}
			return executeQuery('INSERT INTO users (email, password) VALUES ("' + email + '","' + password + '");',
				function(error, results){
					if(results)
					{
						var query = 'INSERT INTO superadmins (sid) VALUES ("' + results.insertId + '");'
						return executeQuery(query,
							function(error, results) {
								return res.json({error: error});
						})
					}
					return res.json({error: error});
			});
	});
});
app.post('/api/addcomment', async(req, res, next) => {
	console.log("add");
	const {text, rating} = req.body;
	var err = '';
	var id = -1;
	var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	return executeQuery('INSERT INTO comments (text, rating, time) VALUES ("' + text + '", "' + rating + '", "' + date + '");',
		function(error, results) {
			if(!error)
			{
				id = result.insertId;
			}
			return res.json({error: error, id: id});
	});
});

app.post('/api/editcomment', async (req, res, next) => {
	const {id, text, rating} = req.body;
	return executeQuery('UPDATE comments SET text="' + text + '", rating="' + rating + '" WHERE id=' + id + ';',
		function(error, results) {
			return res.json({error: error});
	});
});

app.post('/api/deletecomment', async (req, res, next) => {
	const {id} = req.body;
	return executeQuery('DELETE FROM comments WHERE id=' + id, 
		function(error, results) {
			return res.json({error: error});
	});
});

app.post('/api/addlocation', async(req, res, next) => {
	const {name, address, longitude, latitude} = req.body;

	return executeQuery('SELECT * FROM locations WHERE lname="' + name + '";', function (error, result) {
		if(error)
		{
			return res.json({error:error});
		}
		if(result.length > 0)
		{
			return res.json({error:'the location already exists'});
		}
		return executeQuery('INSERT INTO locations (lname, address, longitude, latitude) VALUES ("' + name + '", "' + address + '", "' + longitude + '","' + latitude +'");',
			function(error, results) {
				return res.json({error: error});			
		})
	});
});
app.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
});
function executeQuery(query, callback) {
	con.query(query, function(error, result, fields) {
		if(error)
		{
			console.log(error);
			return callback("unknown error", result);
		}
		return callback("", result);
	});
}
