const User = require("../Models/User");
const Tenant = require("../models/tenants");

const createUser = async (userData) => {
  const {
    tenantId,
    userType,
    firstName,
    lastName,
    age,
    gender,
    phoneNo,
    email,
    password,
    confirmPassword,
    agreeTerms,
  } = userData;

  if (
    !tenantId ||
    !userType ||
    !firstName ||
    !lastName ||
    !age ||
    !gender ||
    !phoneNo ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    throw new Error("All fields are required");
  }

  // Verify the tenant exists and is active
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) {
    throw new Error("Tenant not found. Cannot create user without a valid organization.");
  }
  if (tenant.status === "inactive" || tenant.status === "suspended") {
    throw new Error("This organization is currently inactive or suspended Please contact support.");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User Already Exists");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  } else if (password !== confirmPassword) {
    throw new Error("Passwords does not match");
  }

  if (!/^\d{10}$/.test(phoneNo)) {
    throw new Error("Phone number must be 10 digits");
  }

  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Invalid email format");
  }

  if (!agreeTerms) {
    throw new Error("Please accept the terms and conditions");
  }

  // Password hashing is handled by the model's beforeCreate hook
  // Do NOT hash here — the User model hook does it automatically
  const newUser = await User.create({
    tenantId,
    userType,
    firstName,
    lastName,
    age,
    gender,
    phoneNo,
    email,
    password, // plain text — model hook hashes it
    agreeTerms,
  });

  // Return user without password
  const userJSON = newUser.toJSON();
  delete userJSON.password;

  return userJSON;
};

const getUserDetails = async (email) => {
  if (!email) throw new Error("Email parameter is required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  return user;
};

const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

const updateUsers = async (id, updateData) => {
  if (!id) throw new Error("User ID is required");

  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  const { firstName, lastName, age, gender, phoneNo, about } = updateData;

  if (about && about.length < 20) {
    throw new Error("Please Enter More Than 20 Characters In About");
  }

  if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
    throw new Error("Phone number must be 10 digits");
  }

  if (firstName && firstName.length < 2) {
    throw new Error("First name must be at least 2 characters");
  }

  if (lastName && lastName.length < 2) {
    throw new Error("Last name must be at least 2 characters");
  }

  if (age && age < 15) {
    throw new Error("Age must be greater than 15");
  }

  await user.update({
    firstName,
    lastName,
    age,
    gender,
    phoneNo,
    about,
  });

  return user;
};

module.exports = {
  createUser,
  getUserDetails,
  getAllUsers,
  updateUsers,
};
