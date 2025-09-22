const Users = require("../Models/SignUpModel");

const CreateUser = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }

  const {
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
  } = req.body;
  console.log("Request body:", req.body);

  try {
    if (
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
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const finduser = await Users.findOne({ email: email });
    if (finduser) {
      return res
        .status(400)
        .json({ message: "User Already Exists", success: false });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    } else if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords does not match", success: false });
    }

    if (!/^\d{10}$/.test(phoneNo)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits", success: false });
    }

    if (!email.includes("@") && !email.includes(".")) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    if (!agreeTerms) {
      return res.status(400).json({
        message: "Please accept the terms and conditions",
        success: false,
      });
    }

    const newUser = await Users.create({
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
    });

    await newUser.save();

    if (!newUser) {
      return res.status(400).json({
        message: "User creation failed",
        success: false,
      });
    }
    console.log("New user created:", newUser);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};



const getuserDetails = async (req, res) => {
  
  const { email } = req.params;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email parameter is required", success: false });
    }
    
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ message: "User found", success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = { CreateUser, getuserDetails };
