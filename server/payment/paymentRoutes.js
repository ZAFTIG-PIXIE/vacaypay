var paymentController = require('./paymentController.js');

module.exports = function (app) {

  app.post('/charge', paymentController.chargeParticipant);

}