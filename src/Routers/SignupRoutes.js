const router = require("express").Router();
const {
  CreateUser,
  getuserDetails,
  getAllUsers,
  UpdateUsers,
} = require("../Controller/UserContoller");

router.post("/signup", CreateUser);
router.get("/getuserdetails/:email", getuserDetails);
router.get("/getallusers", getAllUsers);
router.patch("/updateuser/:id", UpdateUsers);

module.exports = router;
