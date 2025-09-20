const router = require('express').Router();

const { CreateLogin } = require('../Controller/loginController');

router.post('/userlogin', CreateLogin);

module.exports = router;