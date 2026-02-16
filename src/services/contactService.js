const ContactUs = require("../Models/ContactUs");
const User = require("../Models/User");

const createContact = async (contactData) => {
  const { fullname, email, phone, subject, message } = contactData;

  if (!fullname || !email || !phone || !subject || !message) {
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Phone number must be 10 digits");
  }

  const newContact = await ContactUs.create({
    fullname,
    email,
    phone,
    subject,
    message,
  });

  return newContact;
};

const getAllContacts = async () => {
  const contacts = await ContactUs.findAll();
  return contacts;
};

module.exports = {
  createContact,
  getAllContacts,
};
