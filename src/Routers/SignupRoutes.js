const router = require('express').Router();
const { CreateUser } = require('../Controller/UserContoller');

router.post('/signup', CreateUser);

module.exports = router;