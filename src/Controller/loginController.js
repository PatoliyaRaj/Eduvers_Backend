const Users = require("../Models/SignUpModel");

const CreateLogin = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }

  const { email, password } = req.body;
  console.log("Request body:", req.body);

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }

    const emailfromate = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailfromate.test(email)) {
      return res.status(401).json({
        message: "Please Enter Valid Email",
        success: false,
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: " Account Not Found PLease Create Account",
        success: false,
      });
    }

    if (user.isLogin === true) {
      return res.status(401).json({
        message: "You Have Already Logged In",
        success: false,
      });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }

    let updateLogin = await Users.updateOne(
      { email: user.email },
      { $set: { isLogin: true } }
    );

    if (!updateLogin) {
      return res.status(500).json({
        message: "Status Updation Faild PLease Try Again",
        success: false,
      });
    }

    res
      .status(200)
      .json({
        message: "Login successful",
        success: true,
        isLogin: true,
        UserType: user.userType,
      });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { CreateLogin };
