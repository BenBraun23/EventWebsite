const express = require("express");
const PORT = 5000;
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser');
const json = require("body-parser/lib/types/json");
const util = require('util');
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
			return res.json({error: error, id: results[0].uid, role: results[0].role});
		});
});


app.post('/api/register', async (req, res, next) => {
	console.log("register");
    const {email, password, role, university} = req.body;
	if(role === "Student")
	{
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
			return executeQuery(`INSERT INTO users (email, password, role, university) VALUES ("${email}", "${password}", "${role}", "${university}");`,
				function(error, results){
					return res.json({error: error});
			});
		});
	}
	else if(role === "Admin")
	{
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
			return executeQuery(`INSERT INTO users (email, password, role, university) VALUES ("${email}", "${password}", "${role}", "${university}");`,
				function(error, results){
					if(results)
					{
						var query = `INSERT INTO admins (aid) VALUES (${results.insertId});`;
						console.log(query);
						return executeQuery(query,
							function(error, results) {
								return res.json({error: error});
						})
					}
					return res.json({error: error});
			});
		});
	}
	else
	{
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
			return executeQuery(`INSERT INTO users (email, password, role) VALUES ("${email}", "${password}", "${role}");`,
				function(error, results){
					if(results)
					{
						var query = 'INSERT INTO superadmins (sid) VALUES ("' + results.insertId + '");';
						return executeQuery(query,
							function(error, results) {
								return res.json({error: error});
						})
					}
					return res.json({error: error});
			});
		});
	}
});

app.post('/api/createUniversity', async(req, res, next) => {
	const {name, location, description, numStudents} = req.body;
	return executeQuery(`INSERT INTO universities (name, lname, description, numstudents) VALUES
	("${name}", "${location}", "${description}", "${numStudents}");`,
		function(error, results) {
			return res.json({error: error});
		}
	)
});
app.post('/api/createLocation', async(req, res, next) => {
	const {name, address, latitude, longitude} = req.body;
	return executeQuery(`INSERT INTO locations (lname, address, latitude, longitude) VALUES
	 ("${name}", "${address}", ${latitude}, ${longitude});`,
		function(error, results) {
			return res.json({error: error});
		}
	)
});
app.post('/api/createEvent', async(req, res, next) => {
	const {name, time, location, description, visibility, university, id} = req.body;
	console.log(visibility);
	console.log(id);
	console.log(name);
	return executeQuery(`INSERT INTO events (lname, time, description, name, university) VALUES
	 ("${location}", "${time}", "${description}", "${name}", "${university}");`,
		function(error, results) {
			if(error)
			{
				return res.json({error: error});
			}
			return executeQuery(`INSERT INTO ${visibility}events (eid, sid) VALUES (${results.insertId}, ${id})`,
				function(error, results) {
					return res.json({error: error});
				}
			)
		}
	)
});
app.post('/api/joinRSO', async(req, res, next) => {
	const {rso, id} = req.body;
	var query = util.promisify(con.query).bind(con);
	var ret;
	try{
		ret = await query(`SELECT rid FROM rsos where name="${rso}"`);
	} catch(e) {
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	return executeQuery(`INSERT INTO students_rsos (uid, rid) VALUES (${id}, ${ret[0].rid})`,
		function(error, results) {
			return res.json({error: error});
		}
	);
});
app.post('/api/locationEvents', async(req, res, next) => {
	const {location, id} = req.body;
	var query = util.promisify(con.query).bind(con);
	var ret;
	try{
		ret = await query(`SELECT university FROM users WHERE uid=${id}`);
	} catch(e) {
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	return executeQuery(
		`select distinct * from events e
		where e.lname="${location}"
		AND e.eid IN (
		select eid from publicevents
		UNION
		select p.eid from privateevents p, events ev
		where ev.university="${ret[0].university}"
		and p.eid=ev.eid
		UNION
		select r.eid from rsoevents r
		where r.rid IN ( 
		select s.rid from students_rsos s
		where s.uid=${id}))`,
		function(error, results) {
			return res.json({error:error, events:results});
		})
});
app.post('/api/universityEvents', async(req, res, next) => {
	const {university, id} = req.body;
	var query = util.promisify(con.query).bind(con);
	var ret;
	try{
		ret = await query(`SELECT university FROM users WHERE uid=${id}`);
	} catch(e) {
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	return executeQuery(
		`select distinct * from events e
		where e.university="${university}"
		AND e.eid IN (
		select eid from publicevents
		UNION
		select p.eid from privateevents p, events ev
		where ev.university="${ret[0].university}"
		and p.eid=ev.eid
		UNION
		select r.eid from rsoevents r
		where r.rid IN ( 
		select s.rid from students_rsos s
		where s.uid=${id}))`,
		function(error, results) {
			return res.json({error:error, events:results});
		})
});
app.post('/api/leaveRSO', async(req, res, next) => {
	const {rso, id} = req.body;
	var query = util.promisify(con.query).bind(con);
	var ret;
	try{
		ret = await query(`SELECT rid FROM rsos where name="${rso}"`);
	} catch(e) {
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	return executeQuery(`DELETE FROM students_rsos WHERE uid=${id} AND rid=${ret[0].rid};`,
		function(error, results) {
			return res.json({error: error});
		}
	);
});
app.post('/api/createRSOEvent', async(req, res, next) => {
	const {name, time, location, description, rso} = req.body;
	var query = util.promisify(con.query).bind(con);
	var ret;
	try{
		ret = await query(`SELECT rid, university FROM rsos where name="${rso}"`);
	}catch(e){
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	if(ret[0].error){
		return res.json({error: ret[0].error});
	}
	return executeQuery(`INSERT INTO events (lname, time, description, name, university) VALUES
	 ("${location}", "${time}", "${description}", "${name}", "${ret[0].university}");`,
		function(error, results) {
			if(error)
			{
				return res.json({error: error});
			}
			return executeQuery(`INSERT INTO rsoevents (eid, rid) VALUES (${results.insertId}, ${ret[0].rid})`,
				function(error, results) {
					return res.json({error: error});
				}
			)
		}
	)
});
app.post('/api/createRSO', async (req, res, next) => {
	const {id, name} = req.body;
	console.log(id);
	var query = util.promisify(con.query).bind(con);
	var ret;
	try {
		ret = await query(`SELECT university FROM users where uid=${id}`);
		console.log(ret[0].university);
	} catch (e) {
		console.log(e);
		return res.json({error: 'unknown error'});
	}
	if(ret[0].error){
		return res.json({error: ret[0].error});
	}
	return executeQuery(`INSERT INTO rsos (aid, active, name, university) VALUES (${id}, false, "${name}", "${ret[0].university}");`,
		function(error, results) {
			console.log(error);
			return res.json({error: error});
		}
	)
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
	const {uid, eid, text, rating} = req.body;
	var err = '';
	var id = -1;
	var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
	return executeQuery(`INSERT INTO comments (uid, eid, text, rating, time) VALUES (${uid}, ${eid}, "${text}", ${rating}, "${date}")`,
		function(error, results) {
			if(!error)
			{
				id = results.insertId;
			}
			return res.json({error: error, id: id});
	});
});
app.post('/api/getComments', async(req, res, next) => {
	console.log("getting comments");
	const {eid} = req.body;
	return executeQuery(`SELECT * FROM comments WHERE eid=${eid}`,
	function(error, results) {
		return res.json({error: error, comments: results})
	})
});
app.post('/api/editcomment', async (req, res, next) => {
	const {cid, text, rating} = req.body;
	return executeQuery(`UPDATE comments SET text="${text}", rating=${rating} WHERE cid=${cid};`,
		function(error, results) {
			return res.json({error: error});
	});
});

app.post('/api/deletecomment', async (req, res, next) => {
	const {cid} = req.body;
	return executeQuery('DELETE FROM comments WHERE cid=' + cid, 
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
