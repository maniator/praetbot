import { getCookies } from '../bin/cookies';

var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req : any, res : any, next : Function) {
  getCookies().then((cookies) => res.json(cookies));
});

module.exports = router;
