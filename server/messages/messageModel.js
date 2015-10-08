var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  messages: [{
    username: {
      type: String
    },
    message: {
      type: String
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('messages', MessageSchema);