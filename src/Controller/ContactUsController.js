const ContactUs = require("../Models/ContactUsModel");
const Users = require("../Models/SignUpModel");

const CreateContact = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body is empty or not properly parsed",
      success: false,
    });
  }

  const { fullname, email, phone, subject, message } = req.body;
  console.log("Request body:", req.body);
  try {
    if (!fullname || !email || !phone || !subject || !message) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const findusers = await Users.findOne({ email: email });
    console.log(findusers);
    if (!findusers || !findusers.isLogin) {
      return res.status(400).json({
        message: "You are not logged in",
        success: false,
      });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be 10 digits",
        success: false,
      });
    }

    const newContact = new ContactUs({
      fullname,
      email,
      phone,
      subject,
      message,
    });

    await newContact.save();

    return res.status(201).json({
      message: "Contact message created successfully",
      success: true,
      contact: newContact,
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};


const GetComments = async (req, res) => {
  try {
    const contacts = await ContactUs.find();

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        message: "No comments found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Comments retrieved successfully",
      success: true,
      contacts: contacts,
    });
    
  } catch (error) {
    console.error("Error retrieving comments:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
module.exports = { CreateContact, GetComments };
