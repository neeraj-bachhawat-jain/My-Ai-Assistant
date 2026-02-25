import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send({ message: "token not found" });
    }

    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "isAyth Error" });
  }
};

export default isAuth;
