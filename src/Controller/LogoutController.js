const Users = require("../Models/SignUpModel");

const LogOutController = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "some thing went wrong,Please Retry",
        success: false,
      });
    }
    const finduser = await Users.findOne({ email: email });
    if (!finduser) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }
    if (finduser.isLogin === false) {
      return res.status(400).json({
        message: "User already logged out",
        success: false,
      });
    }

    const updateStatus = await Users.updateOne(
      { email: email },
      { $set: { isLogin: false } }
    );

    if (updateStatus.modifiedCount === 0) {
      return res.status(500).json({
        message: "Failed to log out",
        success: false,
      });
    }
    
    return res.status(200).json({
      message: "Logged out successfully",
      isLogin: false,
      success: true,
      data: finduser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { LogOutController };
