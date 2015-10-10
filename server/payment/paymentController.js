var User = require('../../server/users/userModel.js');
var Venmo = require('../../server/venmo/venmoKeys.js');
var request = require('request');
var crypto = require('crypto-js');

module.exports = {

  // Input: { charger: username, payer: username, amount: amount, code: code }
  // Output: Status Code
  chargeParticipant: function(req, res){
    var charger = req.body.charger;
    var payer = req.body.payer;
    var amount = req.body.amount;
    var code = req.body.code;

    console.log('Route started');
    
    User.findOne({username: charger}, function(err, chargeUser){
      if(err){
        console.log('Error retrieving user who is the charger');
        res.sendStatus(404);
        return;
      }
      if(chargeUser.access_token === ''){ //check if the user has authentication
        console.log('User has not authenticated through venmo');
        res.sendStatus(404);
        return
      }

      User.findOne({username: payer}, function(err, payUser){
        if(err){
          console.log('Error retrieving user who is the payer');
          res.sendStatus(404);
          return;
        }
        if(payUser.access_token === ''){ //check if the user has authentication
          console.log('User has not authenticated through venmo');
          res.sendStatus(404);
          return;
        }

        //TODO: key = environment encryptkey or venmo.encryptkey
        var access_token = crypto.AES.decrypt(chargeUser.access_token, Venmo.ENCRYPT_KEY);
        var data = {
          access_token: access_token.toString(crypto.enc.Utf8),
          user_id: payUser.venmoUser.id,
          // user_id: 'jennyfan',
          note: 'Trip to ' + code,
          amount: '-' + amount,
          audience: 'private'
        }

        console.log('Data to be sent to venmo api:')
        console.log(data);     

        request({
          url: 'https://api.venmo.com/v1/payments',
          method: 'POST',
          json: data
        }, function(err, response, body){
          if(err){
            res.sendStatus(404);
            return;
          }
          res.status(200).send(body);
          return;
        });

      });
    });
  } 

}