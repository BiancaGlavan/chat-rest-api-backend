import User, { IUser, IUserModel } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const signJWTToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "jwt_secret", {
    expiresIn: "1d",
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    const userExist = await User.exists({ username: req.body.username });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const user = await newUser.save();

    const token = signJWTToken(user.id);

    return res.status(201).json({ success: "User has been created!", user: newUser, access_token: token });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return res.status(400).json("Wrong Credentials!");

    const token = signJWTToken(user.id);

    return res
      .status(200)
      .json({ access_token: token, user: user });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId;
    const user = await User.findById(id).select({ password: 0 });

    return res.status(200).json({ profile: user });
  } catch (error) {
    next(error);
  }
};

const authController = {
  register,
  login,
  profile,
};

export default authController;
