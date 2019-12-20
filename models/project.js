var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    version: String,
    history: [{
      date: Date,
      userID: String, // <-- Set to auth0 user_id
      username: String, // <-- Set to auth0 name
      change: String
    }],
    creator: String,
    users: [{
      userID: String,
      username: String,
      role: String
    }],
    tickets: [{
      ticket: String, // <-- searchable ticket idea
      type: String,
      date: Date,
      title: String,
      status: String,
      creator: String, // <-- user that created the ticket
      assigned: String // <-- user assigned the ticket
    }]
});

module.exports = mongoose.model('Project', ProjectSchema);
