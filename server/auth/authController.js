var User = require('../../server/users/userModel.js');
var Venmo = require('../../server/venmo/venmoKeys.js');
var request = require('request');

// Encrypt access tokens
var crypto = require('crypto-js');

module.exports = {

  retrieveUserToken: function(req, res){
    var usercode = req.query.code;
    var username = req.query.user;

    //TODO: client_id and client_secret = environment clientid and secret or venmo.clientid or secret
    var data = {
      client_id: Venmo.CLIENT_ID,
      client_secret: Venmo.CLIENT_SECRET,
      code: usercode
    }

    request({
      url: 'https://api.venmo.com/v1/oauth/access_token',
      method: 'POST',
      json: data
    }, function(err, response, body){
      if(err) {
        console.log('Error retrieving venmo access key for user');
        res.sendStatus(404);
        return;
      }

      var access_token = body.access_token;
      var venmoUserData = body.user;

      console.log('Access Token before encryption: ' + access_token);

      User.findOne({username: username}, function(err, user){
        if(err){
          console.log('Error retrieving user from database');
          res.sendStatus(404);
          return;
        }

        // Encrypt access tokens
        //TODO: key = environment encryptkey or venmo.encryptkey
        var encrypted = crypto.AES.encrypt(access_token, Venmo.ENCRYPT_KEY);
        user.access_token = encrypted;
        user.venmoUser = venmoUserData;

        console.log('Access Token stored and encrypted in DB: ' + user.access_token);

        user.save(function(err, userData){
          if(err){
            console.log('Error storing venmo access key');
            res.sendStatus(404);
            return;
          }
          // Redirect users after authentication
          res.redirect('/');
        });
      });
    });  
  }

}