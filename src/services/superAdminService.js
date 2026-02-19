const Tenant = require("../models/tenants");
const User = require("../models/User");

/**
 * SuperAdmin Service — Platform-level operations
 * Only superadmins (from tenants table with userType: "superadmin") can use these
 */

// Get all tenants with user counts
const getAllTenants = async () => {
  const tenants = await Tenant.findAll({
    attributes: { exclude: ["password", "token", "refreshToken"] },
    order: [["createdAt", "DESC"]],
  });
  return tenants;
};

// Get tenant details with their users
const getTenantWithUsers = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  const tenant = await Tenant.findByPk(tenantId, {
    attributes: { exclude: ["password", "token", "refreshToken"] },
  });
  if (!tenant) throw new Error("Tenant not found");

  const users = await User.findAll({
    where: { tenantId },
    attributes: { exclude: ["password", "token", "refreshToken"] },
    order: [["createdAt", "DESC"]],
  });

  return { tenant, users };
};

// Promote a tenant to superadmin
const promoteTenant = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error("Tenant not found");

  if (tenant.userType === "superadmin") {
    throw new Error("This tenant is already a superadmin");
  }

  await tenant.update({ userType: "superadmin" });

  const tenantJSON = tenant.toJSON();
  delete tenantJSON.password;
  delete tenantJSON.token;
  delete tenantJSON.refreshToken;

  return tenantJSON;
};

// Demote a superadmin back to admin
const demoteTenant = async (tenantId, requesterId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  if (tenantId === requesterId) {
    throw new Error("You cannot demote yourself");
  }

  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error("Tenant not found");

  if (tenant.userType !== "superadmin") {
    throw new Error("This tenant is not a superadmin");
  }

  // Safety: ensure at least one superadmin remains
  const superadminCount = await Tenant.count({
    where: { userType: "superadmin" },
  });
  if (superadminCount <= 1) {
    throw new Error("Cannot demote the last superadmin. Platform needs at least one.");
  }

  await tenant.update({ userType: "admin" });

  const tenantJSON = tenant.toJSON();
  delete tenantJSON.password;
  delete tenantJSON.token;
  delete tenantJSON.refreshToken;

  return tenantJSON;
};

// Change tenant status (activate / deactivate / suspend)
const changeTenantStatus = async (tenantId, status, requesterId) => {
  if (!tenantId) throw new Error("Tenant ID is required");
  if (!["active", "inactive", "suspended"].includes(status)) {
    throw new Error("Invalid status. Must be: active, inactive, or suspended");
  }

  if (tenantId === requesterId) {
    throw new Error("You cannot change your own status");
  }

  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error("Tenant not found");

  // Don't allow suspending another superadmin
  if (tenant.userType === "superadmin" && status !== "active") {
    throw new Error("Cannot suspend or deactivate another superadmin. Demote them first.");
  }

  await tenant.update({ status });

  // If suspended/deactivated, clear their tokens (force logout)
  if (status !== "active") {
    await tenant.update({ token: null, refreshToken: null });
  }

  const tenantJSON = tenant.toJSON();
  delete tenantJSON.password;
  delete tenantJSON.token;
  delete tenantJSON.refreshToken;

  return tenantJSON;
};

// Get all users across all tenants (platform-wide view)
const getAllUsersAcrossPlatform = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password", "token", "refreshToken"] },
    order: [["createdAt", "DESC"]],
  });
  return users;
};

// Get platform dashboard stats
const getPlatformStats = async () => {
  const totalTenants = await Tenant.count();
  const activeTenants = await Tenant.count({ where: { status: "active" } });
  const suspendedTenants = await Tenant.count({ where: { status: "suspended" } });
  const inactiveTenants = await Tenant.count({ where: { status: "inactive" } });
  const superadminCount = await Tenant.count({ where: { userType: "superadmin" } });

  const totalUsers = await User.count();

  return {
    tenants: {
      total: totalTenants,
      active: activeTenants,
      suspended: suspendedTenants,
      inactive: inactiveTenants,
      superadmins: superadminCount,
    },
    users: {
      total: totalUsers,
    },
  };
};

module.exports = {
  getAllTenants,
  getTenantWithUsers,
  promoteTenant,
  demoteTenant,
  changeTenantStatus,
  getAllUsersAcrossPlatform,
  getPlatformStats,
};
