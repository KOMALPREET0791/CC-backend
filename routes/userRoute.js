import express from "express"
import { loginUser,registerUser } from '../controllers/userController.js';
import authMiddleware from "../middleware/auth.js";
import { getUserProfile, updateUserProfile, changePassword } from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile/:id", getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/changepassword", changePassword);
export default userRouter;
