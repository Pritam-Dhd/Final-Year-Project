import User from "../Schema/UserSchema.js";
import Role from "../Schema/RoleSchema.js";
import jwt from "jsonwebtoken";

// Middleware function to check the token
export const checkAuth = async (req, res, next) => {
  const SecretKey = "JWT_Secret_Key";
  const token = req.cookies.jwt;

  if (!token) {
    res.send({message:"Please login"});
  } else {
    const decodedUser = jwt.verify(token, SecretKey);
    if (!decodedUser) {
      res.send({message:"Invalid token"});
    } else {
      const userId = decodedUser.userId;
      const user = await User.findOne({ _id: userId });
      const role = await Role.findOne({ _id: user.role });
      req.userRole = role.name;
      next(); // Continue to the next middleware or route handler
    }
  }
};
