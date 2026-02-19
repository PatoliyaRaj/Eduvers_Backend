const tenantService = require("../services/tenantService");
const Tenant = require("../models/tenants");
const { generateTokens } = require("../utils/jwtHelper");

/**
 * Smart Registration:
 *  - If 0 tenants exist → public, creates superadmin (bootstrap)
 *  - If tenants exist → only accessible by superadmin (route-level middleware handles auth)
 */
const createTenant = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not properly parsed",
        success: false,
      });
    }

    const newTenant = await tenantService.createTenant(req.body);

    // Generate tokens so tenant is logged in after registration
    const tokens = generateTokens({
      id: newTenant.id,
      email: newTenant.email,
      userType: newTenant.userType,
      firstName: newTenant.name,
      lastName: "",
    });

    // Store tokens in DB
    await Tenant.update(
      { token: tokens.accessToken, refreshToken: tokens.refreshToken },
      { where: { id: newTenant.id } }
    );

    // Set HTTP-only cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const isSuperAdmin = newTenant.userType === "superadmin";

    return res.status(201).json({
      message: isSuperAdmin
        ? "Platform SuperAdmin created successfully. You are the platform owner."
        : "Organization registered successfully",
      success: true,
      data: newTenant,
      ...tokens,
    });
  } catch (error) {
    console.error("Error creating tenant:", error.message);
    return res.status(400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

// Get tenant details by ID
const getTenantDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await tenantService.getTenantById(id);

    return res.status(200).json({
      message: "Tenant found",
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("Error fetching tenant:", error.message);
    return res.status(error.message === "Tenant not found" ? 404 : 400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

// Get all tenants
const getAllTenants = async (req, res) => {
  try {
    const tenants = await tenantService.getAllTenants();
    if (!tenants || tenants.length === 0) {
      return res.status(404).json({
        message: "No tenants found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Tenants found",
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error("Error fetching tenants:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update tenant
const updateTenant = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No data sent for update",
        success: false,
      });
    }

    const { id } = req.params;
    const updatedTenant = await tenantService.updateTenant(id, req.body);

    return res.status(200).json({
      message: "Tenant updated successfully",
      success: true,
      data: updatedTenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error.message);
    return res.status(error.message === "Tenant not found" ? 404 : 400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  createTenant,
  getTenantDetails,
  updateTenant,
};
