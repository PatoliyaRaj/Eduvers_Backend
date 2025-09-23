const router = require('express').Router();

const { CreateContact } = require('../Controller/ContactUsController');

router.post('/submitContact', CreateContact);

module.exports = router;