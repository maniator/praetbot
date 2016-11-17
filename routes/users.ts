import { cookies } from '../bin/cookies';

var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req : any, res : any, next : Function) {
  res.json(cookies);
});

module.exports = router;
