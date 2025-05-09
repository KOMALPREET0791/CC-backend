import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { sendWelcomeEmail } from '../config/mail.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// LOGIN user
export const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    console.log(user._id)
    res.json({ success: true, user, token,userId:user._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// REGISTER user
export const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send Welcome Email
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    const token = createToken(newUser._id);
    res.json({ success: true, newUser, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// GET user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = (req.params.id)
    console.log(userId,"userIduserIduserId")
    const user = await userModel.findById(userId)
    console.log(user)
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};
// UPDATE user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email,userId } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId, // Use req.userId (authMiddleware)
      { name, email },
      { new: true }
    )
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// CHANGE password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword,userId } = req.body;
    const user = await userModel.findById(userId); // Use req.userId (authMiddleware)
    console.log(user,"userID")
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isMatch,"isMatch")
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error changing password" });
  }
};
