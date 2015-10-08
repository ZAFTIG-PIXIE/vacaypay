var User = require('../../server/users/userModel.js');
var Trip = require('../../server/trips/tripModel.js');
var Message = require('./messageModel.js');

module.exports = {

  // Input: code for messages associated with that trip
  // Output: array of message objects each containing created_at, username, message
  getMessages: function(req, res){
    var code = req.query.code;

    Trip.findOne({code: code}, function(err, trip){
      if(trip === null){ // Error handling if trying to add message for non-existent trip
        console.log('Such code does not exist');
        console.log(err);
        res.status(404).end('Such code does not exist');
        return;
      }

      // Find Message associated with that code
      Message.findOne({code: code}, function(err, messages){
        if(messages === null){
          console.log('No messages found with code: ' + code);
          res.sendStatus(404);
          return;
        }

        // Create new message for room if none exist, otherwise just add the message
        res.status(200).send({data: messages.messages});
        return;
      });
    });
  },

  // Input: message object with username, message, and code
  // Output: none, success status
  addMessage: function(req, res){
    var message = req.body.message;
    var username = req.body.username;
    var code = req.body.code;

    Trip.findOne({code: code}, function(err, trip){
      if(trip === null){ // Error handling if trying to add message for non-existent trip
        console.log('Such code does not exist');
        console.log(err);
        res.status(404).end('Such code does not exist');
        return;
      }

      // Find Message associated with that code
      Message.findOne({code: code}, function(err, messages){
        if(err){
          console.log('No messages found with code: ' + code);
          res.sendStatus(404);
          return;
        }

        // Create new messages if there aren't messages for that trip
        if(messages === null){
          Message.create({
            code: code,
            messages: [{
              username: username,
              message: message
            }]
          }, function(err, newMessage){
            if(err){
              console.log('Error creating message with code: ' + code);
              return;
            }
            res.sendStatus(200);
          });
        } else {
          messages.messages.push({
            username: username,
            message: message
          });
          messages.save(function(err){
            if(err){
              console.log('Error saving new message');
              return;
            }
            res.sendStatus(200);
          });
        }
      });
    });
  }

}