const userService = require("../services/userService");

const CreateUser = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body is empty or not properly parsed",
        success: false,
      });
    }

    const newUser = await userService.createUser(req.body);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const getuserDetails = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserDetails(email);

    res.status(200).json({
      message: "User found",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return res.status(error.message === "User not found" ? 404 : 400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Users found",
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const UpdateUsers = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "You not send the data for Update",
        success: false,
      });
    }

    const { id } = req.params;
    const updatedUser = await userService.updateUsers(id, req.body);

    return res.status(200).json({
      message: "Your Detail Is Successfully Updated",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(error.message === "User not found" ? 404 : 400).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  CreateUser,
  getuserDetails,
  getAllUsers,
  UpdateUsers,
};
