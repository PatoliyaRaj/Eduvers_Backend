const authService = require("../services/authService");

const CreateLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set HTTP-only cookies for tokens
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        ...result,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    const status =
      error.message.includes("Not Found") || error.message.includes("Invalid")
        ? 401
        : 400;
    res.status(status).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const LogOutController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.logout(email);

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const RefreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshToken(token);

    // Update cookies if needed
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      data: {
        ...result,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(401).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const GetMe = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({
      message: "Current user retrieved successfully",
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(404).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  CreateLogin,
  LogOutController,
  RefreshToken,
  GetMe,
};
