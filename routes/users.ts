import { getCookies } from '../bin/cookies';

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req: any, res: any, next: Function) {
  getCookies().then((cookies) => res.json(cookies));
});

module.exports = router;
