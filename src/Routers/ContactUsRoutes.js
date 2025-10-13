const router = require('express').Router();

const { CreateContact, GetComments } = require('../Controller/ContactUsController');

router.post('/submitContact', CreateContact);
router.get('/getComments', GetComments);

module.exports = router;