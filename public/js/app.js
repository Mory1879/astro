'use strict';

Backbone.Model.prototype.idAttribute = '_id';


// var astronauts = [
//   { "name": "Sigmund Jähn", "date": 272926800, "days": 7, "mission": "Sojus 31 / Sojus 29", "isMultiple": false },
//   { "name": "Ulf Merbold", "date": 438814800, "days": 10, "mission": "STS-9", "isMultiple": true },
//   { "name": "Reinhard Furrer", "date": 499467600, "days": 7, "mission": "STS-61-A (D1)", "isMultiple": false },
//   { "name": "Ernst Messerschmid", "date": 499467600, "days": 7, "mission": "STS-61-A (D1)", "isMultiple": false },
//   { "name": "Klaus-Dietrich Flade", "date": 700779600, "days": 7, "mission": "Sojus TM-14 / Sojus TM-13", "isMultiple": false },
//   { "name": "Hans Schlegel", "date": 735768000, "days": 9, "mission": "STS-55 (D2)", "isMultiple": true },
//   { "name": "Ulrich Walter", "date": 735768000, "days": 9, "mission": "STS-55 (D2)", "isMultiple": false },
//   { "name": "Thomas Reiter", "date": 810072000, "days": 179, "mission": "Sojus TM-22 / Euromir 95", "isMultiple": true },
//   { "name": "Reinhold Ewald", "date": 855522000, "days": 19, "mission": "Sojus TM-25 / Sojus TM-24", "isMultiple": false },
//   { "name": "Gerhard Thiele", "date": 950216400, "days": 11, "mission": "STS-99", "isMultiple": false },
//   { "name": "Alexander Gerst", "date": 1401224400, "days": 165, "mission": "Sojus TMA-13M / ISS-Expedition 40 /ISS-Expedition 41", "isMultiple": false }
// ]

// Model
var Astronaut = Backbone.Model.extend({
  defaults: {
    name: "",
  	date: "",
  	days: "",
  	mission: "",
  	isMultiple: false
  }
});

// Collection
var AstronautList = Backbone.Collection.extend({
  url: 'http://localhost:3000/api/astronauts'
});


// Collection instance
var astronautList = new AstronautList();

// View for single astronaut
var AstronautView = Backbone.View.extend({
  model: new Astronaut,
  tagName: "tr",

  initialize: function () {
    this.template = _.template($('#astro-template').html())
  },

  events: {
		'click .edit-astro': 'edit', // event to allow editing
		'click .update-astro': 'update', // event to submit edited changes
		'click .cancel': 'cancel',
		'click .delete-astro': 'delete'
	},

  edit: function() {
		$('.edit-astro').hide();
		$('.delete-astro').hide();
		this.$('.update-astro').show();
		this.$('.cancel').show();

		var name = this.$('.name').html();
		var date = this.$('.date').html();
		var days = this.$('.days').html();
    var mission = this.$('.mission').html();
    var isMultiple = this.$('.isMultiple').html();

		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.date').html('<input type="text" class="form-control date-update" value="' + date + '">');
		this.$('.days').html('<input type="text" class="form-control days-update" value="' + days + '">');
    this.$('.mission').html('<input type="text" class="form-control mission-update" value="' + mission + '">');
    this.$('.isMultiple').html('<input type="checkbox" class="form-control isMultiple-update" value="' + isMultiple + '">');
	},

  update: function() {
		this.model.set('name', $('.name-update').val());
		this.model.set('date', $('.date-update').val());
		this.model.set('days', $('.days-update').val());
    this.model.set('mission', $('.mission-update').val());
    this.model.set('isMultiple', $('.isMultiple-update').val());
	},

  cancel: function() {
  appView.render();
  },

  delete: function() {
    this.model.destroy();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// View for all astronauts
var AstronautsView = Backbone.View.extend({
  model: astronautList,

	el: $('.table-body'),

	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

    this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Successfully GOT astronaut with id: ' + item._id);
				})
			},
			error: function() {
				console.log('Failed to get astronauts!');
			}
		});
	},

	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(astronaut) {
			self.$el.append((new AstronautView({model: astronaut})).render().$el);
		});
		return this;
	}
});

var appView = new AstronautsView;

$(document).ready(function() {
	$('.new-astro').on('click', function() {
    var astronaut = new Astronaut({
			name: $('.new-name').val(),
			date: $('.new-date').val(),
			days: $('.new-duration').val(),
      mission: $('.new-mission').val(),
      // checkbox fix
      isMultiple: (function () {
        if($('.new-flight').val()=='on'){
          return true;
        }
        return false;
      } ())
    });
    $('.new-name').val('');
    $('.new-date').val('');
    $('.new-duration').val('');
    $('.new-mission').val('');
    $('.new-flight').val('');
		console.log(astronaut.toJSON());
		astronautList.add(astronaut);
    astronaut.save(null, {
			success: function(response) {
				console.log('Saved id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Fail!');
			}
		});
	})
})
