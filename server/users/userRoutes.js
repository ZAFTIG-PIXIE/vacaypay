var userController = require('./userController.js');

module.exports = function (app) {

  app.get('/invites/:user', userController.getInvites);
  app.get('/notifications', userController.getNotifications);
  app.post('/signup', userController.signup);
  app.post('/signin', userController.signin);
  app.post('/invites', userController.addInvite);
  app.post('/notifications', userController.addNotification);

};
