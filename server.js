const express = require("express");
const PORT = 3000;

const app = express();

app.get("/", function(request, response) {
	response.send("Hello World!");
})

app.listen(PORT, function() {
	console.log(`Server listening on port ${PORT}`);
})
