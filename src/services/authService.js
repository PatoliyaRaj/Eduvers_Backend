const User = require("../Models/User");
const Tenant = require("../models/tenants");
const bcrypt = require("bcryptjs");

/**
 * Unified login — checks Tenant table first, then User table.
 * This way both org admins and regular users use the same /Auth/Login endpoint.
 */
const login = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { generateTokens } = require("../utils/jwtHelper");

  // 1) Try to find as Tenant (org admin / superadmin)
  const tenant = await Tenant.findOne({ where: { email } });
  if (tenant) {
    const isMatch = await tenant.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const tokens = generateTokens({
      id: tenant.id,
      email: tenant.email,
      userType: tenant.userType,
      firstName: tenant.name,
      lastName: "",
    });

    await tenant.update({
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return {
      ...tokens,
      user: {
        id: tenant.id,
        email: tenant.email,
        firstName: tenant.name,
        lastName: "",
        userType: tenant.userType,
        role: "tenant",
      },
    };
  }

  // 2) Try to find as User (student / teacher / admin)
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Account Not Found Please Create Account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const tokens = generateTokens(user);

  await user.update({
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return {
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      tenantId: user.tenantId,
      role: "user",
    },
  };
};

const logout = async (email) => {
  if (!email) throw new Error("something went wrong, Please Retry");

  // Try tenant first, then user
  const tenant = await Tenant.findOne({ where: { email } });
  if (tenant) {
    await tenant.update({ token: null, refreshToken: null });
    return { success: true };
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Account Not Found");

  await user.update({ token: null, refreshToken: null });
  return { success: true };
};

const refreshToken = async (token) => {
  if (!token) throw new Error("Refresh token is required");

  const { verifyRefreshToken, generateTokens } = require("../utils/jwtHelper");
  const decoded = verifyRefreshToken(token);
  if (!decoded) throw new Error("Invalid or expired refresh token");

  // Try tenant first, then user
  let account = await Tenant.findByPk(decoded.id);
  let isTenant = !!account;

  if (!account) {
    account = await User.findByPk(decoded.id);
  }

  if (!account || account.refreshToken !== token) {
    throw new Error("Invalid or revoked refresh token");
  }

  const tokenPayload = isTenant
    ? { id: account.id, email: account.email, userType: account.userType, firstName: account.name, lastName: "" }
    : account;

  const tokens = generateTokens(tokenPayload);

  await account.update({
    token: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

const getUserById = async (id) => {
  // Try tenant first, then user
  let account = await Tenant.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!account) {
    account = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  }

  if (!account) throw new Error("Account not found");
  return account;
};

module.exports = {
  login,
  logout,
  refreshToken,
  getUserById,
};
