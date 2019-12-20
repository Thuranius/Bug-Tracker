const express = require('express'),
      Project = require('../models/project'),
      db      = require('mongoose');
var   router  = express.Router();

router.post('/newProject', (req,res) => {
  Project.create({
    name: req.body.projectName,
    description: req.body.description,
    status: 'Created',
    version: '0.0.0',
    history: [{
      date: Date.now(),
      userID: req.user.user_id, // <-- Set to auth0 user_id
      username: req.user.name.givenName + ' ' + req.user.name.familyName, // <-- Set to auth0 name
      change: 'Project created'
    }],
    creator: req.user.name.givenName + ' ' + req.user.name.familyName,
    users: [{
      userID: req.user.user_id,
      username: req.user.name.givenName + ' ' + req.user.name.familyName,
      role: 'Owner'
    }]
  }, (err, project) => {
    if(err){
      console.log("Mongoose Error: " + err.message);
    }
  });
  res.redirect('back')
})

module.exports = router;
