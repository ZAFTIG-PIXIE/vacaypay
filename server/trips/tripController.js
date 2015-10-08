var User = require('../../server/users/userModel.js');
var Trip = require('./tripModel.js');
var PastTrip = require('./pastTripModel.js');
var _ = require('underscore');

module.exports = {
	// Input: user query that contains user ID
	// Output: Current trip of user on response body
	getCurrentTrip: function(req, res){
		var id = req.query.id;
		// Look for user document referenced by ID
		User.findById(id, function(err, user){
			if(user === null){	// Error handling for user not found
				console.log('User not found');
				console.log(err);
				res.status(404).end();
				return;
			}
			// Find trip by id contained by current trip of found user
			Trip.findById(user.currentTrip, function(err, currenttrip){
				// If the trip doesn't exist (null/undefined), this means
				// that the trip ended so we set it to null for user and return nothing.
				if(currenttrip === null){
					user.currentTrip = null;
					user.save(function(err, userdata){
						if(err){
							console.log('error saving user');
							console.log(err);
							res.status(404).end();
							return;
						}
						res.status(200).send(currenttrip).end();
						return;
					});
				} else {
					// If the current trip is found, send it back to user
					res.status(200).send(currenttrip).end();
					return;
				}
			});
		});
	},

	// Input: Request containing id of requested user, name of trip, and trip code
	// Output: Created trip in response body
	createTrip: function(req, res){
		var data = req.body;
		var id = data.id;
		var tripName = data.name;
		var code = data.code;
		// Find user by given id
		User.findById(id, function(err, user){
			if(user === null) {	// Error handling when user is not found
				console.log('User not found');
				console.log(err);
				res.status(404).end();
				return;
			}
			// Create trip according to given info. Reference tripModel.js for schema reference
			Trip.create({
				creator: {id: user._id, username: user.username},
				participants: [{id: user._id, username: user.username}],
				name: tripName,
				code: code,
				expenses: []
			}, function(err, newTrip){
				if(newTrip === null) {	// Error handling for code that's already taken
					console.log('code is already taken');
					console.log(err)
					res.status(422).end();
					return;
				}
				// Set the current trip of creator to the newly created trip
				user.currentTrip = newTrip._id;
				user.save( function (err, result) {	// Save edited current trip info of user
					if(err){
						console.log('error saving user');
						console.log(err);
						res.status(500).end();
						return;
					}
					res.status(201).send(newTrip).end();
					return;
				});
			});
		});
	},

	// Input: id of user and code of trip that the user wishes to join
	// Output: response body with joined trip info
	joinTripByCode: function(req, res){
		var data = req.body;
		var id = data.id;
		var code = data.code;
		// Find trip by code
		Trip.findOne({code:code}, function(err, trip){
			if(trip === null){	// Error handling for non-existent trip
				console.log('Such code does not exist');
				console.log(err);
				res.status(404).end('Such code does not exist');
				return;
			}
			// Find user by given id
			User.findById(id, function(err, user){
				if(user === null){	// Error handling
					console.log('couldn\'t find user for some reason');
					console.log(err);
					res.status(404).end('User not found');
					return;
				}
				// Set current trip of user to that trip
				user.currentTrip = trip._id;
				// Update pending trip particpant info of trip
				// trip.participants.push({id: user._id, username: user.username});
				trip.pendingJoin.push({id: user._id, username: user.username});
				trip.save(function(err, tripresult){	// Save updated info
					if (err) {	// Error handling for trip update
						console.log('Problem updating trip');
						console.log(err);
						res.status(500).end();
						return;
					}
					// Save edited info
					user.save(function(err, userresult){
						if(err){
							console.log('error saving user');
							console.log(err);
							res.status(500).end();
							return;
						}
						res.status(200).send(tripresult).end();
						return;
					});
				});
			});
		});
	},

	// Input: id of user and code of trip that the user wishes to join
	// Output: response body with joined trip info
	approveParticipant: function(req, res){
		var data = req.body;
		var id = data.id;
		var code = data.code;
		// Find trip by code
		Trip.findOne({code:code}, function(err, trip){
			if(trip === null){	// Error handling for non-existent trip
				console.log('Such code does not exist');
				console.log(err);
				res.status(404).end('Such code does not exist');
				return;
			}
			// Find user by given id
			User.findById(id, function(err, user){
				if(user === null){	// Error handling
					console.log('couldn\'t find user for some reason');
					console.log(err);
					res.status(404).end('User not found');
					return;
				}
				// Set current trip of user to that trip
				user.currentTrip = trip._id;
				// Update participant info of trip
				trip.participants.push({id: user._id, username: user.username});

				// Remove added participant from pending 
				trip.pendingJoin = _.reject(trip.pendingJoin, function(participant){
					return participant.username === user.username;
				});

				trip.save(function(err, tripresult){	// Save updated info
					if (err) {	// Error handling for trip update
						console.log('Problem updating trip');
						console.log(err);
						res.status(500).end();
						return;
					}
					// Save edited info
					user.save(function(err, userresult){
						if(err){
							console.log('error saving user');
							console.log(err);
							res.status(500).end();
							return;
						}
						res.status(200).send(tripresult).end();
						return;
					});
				});
			});
		});
	},

	// Input: info of expense added by user. Reference database schema for detail.
	// Output: response body with joined trip info
	addExpense: function(req, res){
		var data = req.body;
		var id = data.id;
		var name = data.name;
		var amount = data.amount;
		var stakeholders = data.stakeholders;
		// Find user by given id
		User.findById(id, function(err, user){
			if(user === null){ 	// Error handling for non-existent user
				console.log('User not found');
				console.log(err);
				res.status(404).end();
				return;
			}
			// Find trip by user's current trip id property
			Trip.findById(user.currentTrip, function(err, trip){
				if(trip === null) {
					console.log('Trip with given user as participant not found');
					console.log(err);
					res.status(404).end();
					return;
				}
				// Nex expense object
				var newExpense = {
					name: name,
					amount: amount,
					payer: {id: user._id, username: user.username},
					stakeholders: stakeholders
				};
				// Update expense in trip
				trip.expenses.push(newExpense);
				// Save update
				trip.save(function(err, trip){
					if(trip === null) {	// Error handling for save
						console.log('Error saving trip');
						console.log(err);
						res.status(500).end();
						return;
					}
					res.status(201).send(trip).end();
					return;
				});
			});
		});
	},

	// Input: Request body with data of finalized trip data
	// Output: 201 response from server
	endTrip: function(req, res){
		var id = req.body._id;
		var data = req.body;
		delete data._id;
		// Create past trip according to given trip info
		PastTrip.create(data, function(err, past){
			if(past === null){	// Past trip creation error handling
				console.log('error creating past trip');
				console.log(err);
				res.status(500).end();
				return;
			} 
			// Once past trip is created, delete existing trip
			Trip.findByIdAndRemove(id, function(err, result){
				if (result === null) {	// Error handling for trip find removal failure
					console.log('could not delete trip');
					console.log(err);
					res.status(500).end();
					return;
				}
				res.status(201).end();
				return;
			});
		});
	},

	// Input: Request body with if of requested user
	// Output: Most recent trip of user (by date embedded in _id)
	getRecent: function(req, res){
		var id = req.query.id;
		var username = req.query.username;
		// Find past trip
		
		PastTrip.find({participants:{$elemMatch: { id: id, username: username }}} )
			.sort('-_id')
			.limit(10)
			.exec(function(err, data){
				console.log(data)
				if(data.length === 0){	// Error handling for no past trip found for user
					console.log('Trip with user as participant not found');
					res.status(404).end();
					return;
				}
				PastTrip.findById(data[0]._id, function (err, data) {
					if(data === null) {
						console.log('Trip not found after finding user');
						console.log(err);
						res.status(404).end();
						return;
					}
					console.log(data);
					res.status(200).send(data).end();
					return;
				});
			});
	}
};