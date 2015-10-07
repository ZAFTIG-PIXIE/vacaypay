// Todo Implement and export schema using mongoose
// Reference angular sprint
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var SALT_WORK_FACTOR = 10;

var Trip = require('../trips/tripModel.js');
var PastTrip = require('../trips/pastTripModel.js');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	currentTrip: {
		type: Schema.Types.ObjectId,
		ref: 'Trip'
	},
	pastTrip: {
		type: [Schema.Types.ObjectId],
		ref: 'PastTrip'
	},
	notifications: [{
		message: {
			type: String 
		},
		date: {
			type: Date
		}
	}],
	invites: [String],
	salt: String
});

UserSchema.methods.comparePasswords = function(pw){
	var defer = Q.defer();
	var rpw = this.password;

	bcrypt.compare(pw, rpw, function(err, auth){
		if(err) defer.reject(err);
		defer.resolve(auth);
	});
	return defer.promise;
}

UserSchema.pre('save', function(next){
	var user = this;

	if(!user.isModified('password')){
		return next();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err);

			user.password = hash;
			user.salt = salt;
			next();
		});
	});
});

module.exports = mongoose.model('users', UserSchema);