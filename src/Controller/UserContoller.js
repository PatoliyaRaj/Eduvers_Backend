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

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found", success: false });
    }
    res.status(200).json({ message: "Users found", success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const UpdateUsers = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "You not send the data for Update",
      success: false,
    });
  }

  try {
    const { firstName, lastName, age, gender, phoneNo, about } = req.body;
    req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "Occurs Some Issues Please Try Agani",
        success: false,
      });
    }

    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (about && about.length < 20) {
      return res.status(404).json({
        message: "Please Enter More Than 20 Characters In About",
        success: false,
      });
    }

    if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits", success: false });
    }

    if (firstName && firstName.length < 2) {
      return res.status(400).json({
        message: "First name must be at least 2 characters",
        success: false,
      });
    }

    if (lastName && lastName.length < 2) {
      return res.status(400).json({
        message: "Last name must be at least 2 characters",
        success: false,
      });
    }

    if (age && age < 15) {
      return res.status(400).json({
        message: "Age must be greater than 15",
        success: false,
      });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(age && { age }),
          ...(gender && { gender }),
          ...(phoneNo && { phoneNo }),
          ...(about && { about }),
        },
      },
      { new: true }
    );

    
    if (!updatedUser) {
      return res.status(400).json({
        message: "Something Went Wrong , Please Try Again",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Your Detail Is Successfully Updated",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
module.exports = { CreateUser, getuserDetails, getAllUsers, UpdateUsers };
