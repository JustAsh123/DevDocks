import jwt from "jsonwebtoken";

const tokenValidator = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ status: false, message: "Token not found" });
  }
  const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  req.user = decodedToken;
  next();
};

export default tokenValidator;
