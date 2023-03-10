import jwt from "jsonwebtoken";
import config from "config";
import dotenv from 'dotenv';

dotenv.config();

// const env = config.get("env_name");
const jwtConfig = config.get("jwt");

export const authenticateUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      data: "",
      message: "Unauthorized!",
    });
  }

  jwt.verify(token, jwtConfig.jwt_secret, async (err, _id) => {
    if (err) {
      return res.status(401).json({
        data: "",
        message: "Invalid token. Login is required to access this resource",
      });
    }

    req.id = _id.id;

    // req.authInfo = { id: _id.id, usertype: _id.userType };
    req.JWT = token;
    next();
  });
};

export const generateUserAccessToken = async (user) => {
  return {
    accessToken: jwt.sign(user, jwtConfig.jwt_secret, {
      expiresIn: "1w",
      issuer: "brightnwokoro.com",
    }),
  };
};

export const setUserAuthResHeader = (req, res, next) => {
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  res.set("Authorization", `Bearer ${req.JWT}`);
  next();
};
