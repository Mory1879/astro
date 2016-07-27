'use strict';

Backbone.Model.prototype.idAttribute = '_id';

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
  url: 'http://localhost:3000/api/astronauts',
  initialize: function () {
    this.sortVar = 'Name';
  },
  comparator: function(model){
    return model.get(this.sortVar);
  }
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
    var isMultiple = (this.$(".isMultiple").attr('mult'))==="true"?true:false;


		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.date').html('<input type="text" class="form-control date-update" value="' + date + '">');
		this.$('.days').html('<input type="text" class="form-control days-update" value="' + days + '">');
    this.$('.mission').html('<input type="text" class="form-control mission-update" value="' + mission + '">');
    this.$('.isMultiple').html('<input type="checkbox" class="form-control isMultiple-update" ' + (isMultiple ? (" checked") : null) + '>');
	},

  update: function() {
		this.model.set('name', $('.name-update').val());
		this.model.set('date', $('.date-update').val());
		this.model.set('days', $('.days-update').val());
    this.model.set('mission', $('.mission-update').val());
    this.model.set('isMultiple', $('.isMultiple-update').prop("checked") ? true : false);
    this.model.save(null, {
			success: function(response) {
				console.log('Saved id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Fail!');
			}
		});
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
      // checkbox fix v2
      isMultiple: $(".new-flight").prop("checked")? true : false
    });
    $('.new-name').val('');
    $('.new-date').val('');
    $('.new-duration').val('');
    $('.new-mission').val('');
    $('.new-flight').val('');
		astronautList.add(astronaut);
    astronaut.save(null, {
			success: function(response) {
				console.log('Saved id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Fail!');
			}
		});
	});
  $('.name-sort').on('click',function () {
    astronautList.sortVar = 'name';
    astronautList.sort();
    appView.render();
    $('.name-sort').hide();
    $('.mult-sort').show();
    $('.date-sort').show();
    $('.duration-sort').show();
    $('.mission-sort').show();
  });
  $('.mult-sort').on('click',function () {
    astronautList.sortVar = 'isMultiple';
    astronautList.sort();
    appView.render();
    $('.mult-sort').hide();
    $('.name-sort').show();
    $('.date-sort').show();
    $('.duration-sort').show();
    $('.mission-sort').show();
  });
  $('.date-sort').on('click',function () {
    astronautList.sortVar = 'date';
    astronautList.sort();
    appView.render();
    $('.mult-sort').show();
    $('.name-sort').show();
    $('.date-sort').hide();
    $('.duration-sort').show();
    $('.mission-sort').show();
  });
  $('.duration-sort').on('click',function () {
    astronautList.sortVar = 'days';
    astronautList.sort();
    appView.render();
    $('.mult-sort').show();
    $('.name-sort').show();
    $('.date-sort').show();
    $('.duration-sort').hide();
    $('.mission-sort').show();
  });
  $('.mission-sort').on('click',function () {
    astronautList.sortVar = 'mission';
    astronautList.sort();
    appView.render();
    $('.mult-sort').show();
    $('.name-sort').show();
    $('.date-sort').show();
    $('.duration-sort').show();
    $('.mission-sort').hide();
  });
})
