var messageController = require('./messageController.js');

module.exports = function (app) {

  app.get('/messages', messageController.getMessages);
  app.post('/messages', messageController.addMessage);

};