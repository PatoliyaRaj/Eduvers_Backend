const User = require("../Models/User");
const bcrypt = require("bcryptjs");

const login = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Account Not Found Please Create Account");
  }

  let isMatch = false;
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch (err) {
    isMatch = user.password === password;
  }

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const { generateTokens } = require("../utils/jwtHelper");
  const tokens = generateTokens(user);

  // Store both tokens in database for session management
  await user.update({
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return {
    userType: user.userType,
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};

const logout = async (email) => {
  if (!email) throw new Error("something went wrong, Please Retry");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User Not Found");

  // Clear both tokens from database on logout
  await user.update({
    token: null,
    refreshToken: null,
  });

  return {
    success: true,
  };
};

const refreshToken = async (token) => {
  if (!token) throw new Error("Refresh token is required");

  const { verifyRefreshToken, generateTokens } = require("../utils/jwtHelper");
  const decoded = verifyRefreshToken(token);

  if (!decoded) throw new Error("Invalid or expired refresh token");

  const user = await User.findByPk(decoded.id);

  // Validate that the refresh token matches what's in the DB
  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid or revoked refresh token");
  }

  // Generate new tokens
  const tokens = generateTokens(user);

  // Update both tokens in database
  await user.update({
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user;
};

module.exports = {
  login,
  logout,
  refreshToken,
  getUserById,
};
