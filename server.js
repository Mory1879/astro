var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/astronaut');

var Schema = mongoose.Schema;


var AstroSchema = new Schema({
	name: String,
	date: String,
	days: String,
	mission: String,
	isMultiple: Boolean
});

mongoose.model('Astronaut', AstroSchema);

var Astronaut = mongoose.model('Astronaut');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES

app.get('/api/astronauts', function(req, res) {
	Astronaut.find(function(err, docs) {
		docs.forEach(function(item) {
			console.log("Received a GET request for _id: " + item._id);
		})
		res.send(docs);
	});
});

app.post('/api/astronauts', function(req, res) {
	console.log('Received a POST request:')
	for (var key in req.body) {
		console.log(key + ': ' + req.body[key]);
	}
	var astronaut = new Astronaut(req.body);
	astronaut.save(function(err, doc) {
		res.send(doc);
	});
});

app.delete('/api/astronauts/:id', function(req, res) {
	console.log('Received a DELETE request for _id: ' + req.params.id);
	Astronaut.remove({_id: req.params.id}, function(err, doc) {
		res.send({_id: req.params.id});
	});
});

app.put('/api/astronauts/:id', function(req, res) {
	console.log('Received an UPDATE request for _id: ' + req.params.id);
	Astronaut.update({_id: req.params.id}, req.body, function(err) {
		res.send({_id: req.params.id});
	});
});

var port = 3000;

app.listen(port);
console.log('server on ' + port);
