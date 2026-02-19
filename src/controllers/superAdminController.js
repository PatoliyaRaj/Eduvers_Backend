const superAdminService = require("../services/superAdminService");

/**
 * SuperAdmin Controller — Platform-level operations
 * All routes using this controller must be protected with:
 *   authenticate → isTenantOwner → authorize("superadmin")
 */

// GET /SuperAdmin/Tenants — List all tenants
const getAllTenants = async (req, res) => {
  try {
    const tenants = await superAdminService.getAllTenants();

    return res.status(200).json({
      message: "All tenants retrieved",
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error("SuperAdmin - Get all tenants error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// GET /SuperAdmin/Tenant/:id — Get one tenant with its users
const getTenantWithUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await superAdminService.getTenantWithUsers(id);

    return res.status(200).json({
      message: "Tenant details with users retrieved",
      success: true,
      data,
    });
  } catch (error) {
    console.error("SuperAdmin - Get tenant error:", error.message);
    return res
      .status(error.message === "Tenant not found" ? 404 : 400)
      .json({ message: error.message, success: false });
  }
};

// PATCH /SuperAdmin/Promote/:id — Promote tenant to superadmin
const promoteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await superAdminService.promoteTenant(id);

    return res.status(200).json({
      message: `${tenant.name} has been promoted to SuperAdmin`,
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("SuperAdmin - Promote error:", error.message);
    return res
      .status(error.message.includes("not found") ? 404 : 400)
      .json({ message: error.message, success: false });
  }
};

// PATCH /SuperAdmin/Demote/:id — Demote superadmin back to admin
const demoteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await superAdminService.demoteTenant(id, req.user.id);

    return res.status(200).json({
      message: `${tenant.name} has been demoted to Admin`,
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("SuperAdmin - Demote error:", error.message);
    return res
      .status(error.message.includes("not found") ? 404 : 400)
      .json({ message: error.message, success: false });
  }
};

// PATCH /SuperAdmin/Status/:id — Change tenant status (active/inactive/suspended)
const changeTenantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required (active, inactive, or suspended)",
        success: false,
      });
    }

    const tenant = await superAdminService.changeTenantStatus(id, status, req.user.id);

    return res.status(200).json({
      message: `${tenant.name} status changed to ${status}`,
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("SuperAdmin - Status change error:", error.message);
    return res
      .status(error.message.includes("not found") ? 404 : 400)
      .json({ message: error.message, success: false });
  }
};

// GET /SuperAdmin/Users — All users across all tenants
const getAllUsers = async (req, res) => {
  try {
    const users = await superAdminService.getAllUsersAcrossPlatform();

    return res.status(200).json({
      message: "All platform users retrieved",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("SuperAdmin - Get all users error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// GET /SuperAdmin/Stats — Platform dashboard stats
const getPlatformStats = async (req, res) => {
  try {
    const stats = await superAdminService.getPlatformStats();

    return res.status(200).json({
      message: "Platform statistics retrieved",
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("SuperAdmin - Stats error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  getAllTenants,
  getTenantWithUsers,
  promoteTenant,
  demoteTenant,
  changeTenantStatus,
  getAllUsers,
  getPlatformStats,
};
