const router = require('express').Router();
const { CreateUser , getuserDetails , getAllUsers} = require('../Controller/UserContoller');

router.post('/signup', CreateUser);
router.get('/getuserdetails/:email', getuserDetails);
router.get('/getallusers', getAllUsers);

module.exports = router;