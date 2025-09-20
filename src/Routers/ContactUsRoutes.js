const router = require('express').Router();

const { CreateContact } = require('../Controller/ContactUsController');

router.post('/submit', CreateContact);

module.exports = router;