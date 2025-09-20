const LogoutRoutes = require("express").Router();
const { LogOutController } = require("../Controller/LogoutController");

LogoutRoutes.post("/Userlogout", LogOutController);

module.exports = LogoutRoutes;