var express = require('express');
var router = express.Router();

router.get('/toDo', (req,res) => {
  res.render('toDo');
});

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index');
});

module.exports = router;
