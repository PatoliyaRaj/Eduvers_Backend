const Tenant = require("../models/tenants");

const createTenant = async (tenantData) => {
  const {
    name,
    phoneNo,
    OrgOwnerName,
    OrgOwnerEmail,
    OrgOwnerPhone,
    email,
    password,
    ConformPassword,
    agreeTerms,
    about,
  } = tenantData;

  // Required fields check
  if (
    !name ||
    !phoneNo ||
    !OrgOwnerName ||
    !OrgOwnerEmail ||
    !OrgOwnerPhone ||
    !email ||
    !password ||
    !ConformPassword
  ) {
    throw new Error("All fields are required");
  }

  // Check if tenant email already exists
  const existingTenant = await Tenant.findOne({ where: { email } });
  if (existingTenant) {
    throw new Error("Organization with this email already exists");
  }

  // Password validation
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (password !== ConformPassword) {
    throw new Error("Passwords do not match");
  }

  // Phone validation
  if (!/^\d{10}$/.test(phoneNo)) {
    throw new Error("Phone number must be 10 digits");
  }

  if (!/^\d{10}$/.test(OrgOwnerPhone)) {
    throw new Error("Owner phone number must be 10 digits");
  }

  // Email validation
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Invalid email format");
  }

  if (!OrgOwnerEmail.includes("@") || !OrgOwnerEmail.includes(".")) {
    throw new Error("Invalid owner email format");
  }

  if (!agreeTerms) {
    throw new Error("Please accept the terms and conditions");
  }

  // Password hashing is handled by the model's beforeCreate hook
  // Do NOT hash here — the Tenant model hook does it automatically

  // Determine userType:
  // - If no tenants exist yet → first tenant becomes "superadmin" (bootstrap)
  // - If called by superadmin → create as "admin"
  // - Can be overridden via tenantData.userType for superadmin actions
  let assignedUserType = tenantData.userType || "admin";

  const tenantCount = await Tenant.count();
  if (tenantCount === 0) {
    assignedUserType = "superadmin"; // First ever tenant = platform owner
  }

  const newTenant = await Tenant.create({
    name,
    phoneNo,
    OrgOwnerName,
    OrgOwnerEmail,
    OrgOwnerPhone,
    email,
    password, // plain text — model hook hashes it
    userType: assignedUserType,
    agreeTerms,
    about: about || "",
  });

  // Return tenant without password
  const tenantJSON = newTenant.toJSON();
  delete tenantJSON.password;

  return tenantJSON;
};

const getTenantById = async (id) => {
  if (!id) throw new Error("Tenant ID is required");

  const tenant = await Tenant.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!tenant) throw new Error("Tenant not found");

  return tenant;
};

const getTenantByEmail = async (email) => {
  if (!email) throw new Error("Email is required");

  const tenant = await Tenant.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });
  if (!tenant) throw new Error("Tenant not found");

  return tenant;
};

const getAllTenants = async () => {
  const tenants = await Tenant.findAll({
    attributes: { exclude: ["password"] },
  });
  return tenants;
};

const updateTenant = async (id, updateData) => {
  if (!id) throw new Error("Tenant ID is required");

  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw new Error("Tenant not found");

  const { name, phoneNo, OrgOwnerName, OrgOwnerEmail, OrgOwnerPhone, about } =
    updateData;

  if (about && about.length < 20) {
    throw new Error("Please enter more than 20 characters in About");
  }

  if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
    throw new Error("Phone number must be 10 digits");
  }

  if (OrgOwnerPhone && !/^\d{10}$/.test(OrgOwnerPhone)) {
    throw new Error("Owner phone number must be 10 digits");
  }

  await tenant.update({
    name,
    phoneNo,
    OrgOwnerName,
    OrgOwnerEmail,
    OrgOwnerPhone,
    about,
  });

  const tenantJSON = tenant.toJSON();
  delete tenantJSON.password;

  return tenantJSON;
};

module.exports = {
  createTenant,
  getTenantById,
  getTenantByEmail,
  getAllTenants,
  updateTenant,
};
