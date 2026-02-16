const { Users } = require("../Models");

/**
 * Logout Controller - Clears JWT tokens and logs out user
 */
const LogOutController = async (req, res) => {
  try {
    // Get user from authenticate middleware or request body
    const userId = req.user?.id;
    const email = req.body?.email;

    if (!userId && !email) {
      return res.status(400).json({
        message: "User identification required",
        success: false,
      });
    }

    // Find and update user
    const whereClause = userId ? { id: userId } : { email: email };
    const user = await Users.findOne({ where: whereClause });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Clear token and login status in database
    const [updateCount] = await Users.update(
      { isLogin: false, token: null },
      { where: whereClause }
    );

    if (updateCount === 0) {
      return res.status(500).json({
        message: "Failed to log out",
        success: false,
      });
    }

    // Clear HTTP-only cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { LogOutController };
