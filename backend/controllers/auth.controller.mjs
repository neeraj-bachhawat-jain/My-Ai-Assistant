import User from "../models/userModel.mjs";
import bcrypt from "bcryptjs";
import genToken from "../config/token.mjs";

export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).send({ message: "email already exists!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send({ message: "Passwosd must be long 6 characters!" });
    }
    const hashPasword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPasword,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({ message: `Sign up error ${error}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "email does not exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Incorrect Password" });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ message: `login error ${error}` });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ message: "user successfully logout" });
  } catch (error) {
    return res.status(500).send({ message: `logout error ${error}` });
  }
};
