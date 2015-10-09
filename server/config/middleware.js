var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function(app, express) {
  var tripRouter = express.Router();
  var userRouter = express.Router();
  var messageRouter = express.Router();
  var authRouter = express.Router();
  var paymentRouter = express.Router();

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../../client')));
  
  app.use('/users', userRouter);
  app.use('/trips', tripRouter);
  app.use('/messages', messageRouter);
  app.use('/oauth', authRouter);
  app.use('/venmo', paymentRouter);

  require('../users/userRoutes.js')(userRouter);
  require('../trips/tripRoutes.js')(tripRouter);
  require('../messages/messageRoutes.js')(messageRouter);
  require('../auth/authRoutes.js')(authRouter);
  require('../payment/paymentRoutes.js')(paymentRouter);

};
