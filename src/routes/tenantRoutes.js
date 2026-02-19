const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");
const Tenant = require("../models/tenants");
const { authenticate, authorize, isTenantOwner } = require("../middlewares/authMiddleware");

/**
 * Smart Registration Middleware:
 *  - If 0 tenants exist → skip auth (bootstrap: creates first superadmin)
 *  - If tenants exist → require superadmin authentication
 */
const smartRegisterAuth = async (req, res, next) => {
  try {
    const count = await Tenant.count();
    if (count === 0) {
      return next();
    }
    authenticate(req, res, (err) => {
      if (err) return next(err);
      authorize("superadmin")(req, res, next);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

router.post("/Register", smartRegisterAuth, tenantController.createTenant);

router.get("/Details/:id", authenticate, tenantController.getTenantDetails);
router.patch("/Update/:id", authenticate, isTenantOwner, authorize("admin", "superadmin"), tenantController.updateTenant);

module.exports = router;
