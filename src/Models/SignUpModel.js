const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    userType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    agreeTerms: { type: Boolean, default: false },
    isLogin: {type:Boolean , default:false}
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

module.exports = Users;
