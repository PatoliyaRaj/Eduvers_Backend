const router = require('express').Router();
const { CreateUser , getuserDetails} = require('../Controller/UserContoller');

router.post('/signup', CreateUser);
router.get('/getuserdetails/:email', getuserDetails);

module.exports = router;