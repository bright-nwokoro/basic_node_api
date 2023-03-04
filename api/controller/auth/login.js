import User from "../../model/user/index.js";
import { generateUserAccessToken } from "../../middlewares/auth/index.js";

export const login = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    return res.status(400).json({
      data: "",
      message: "You are already logged in",
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      data: "",
      message: "One or more field is required",
    });
  }

  const now = new Date();
  const utcTime = now.toUTCString(); // or now.toISOString()

  const user = await User.findOne({
    email: email,
    password: password,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "No user was found",
    });
  }

  const AccessToken = await generateUserAccessToken({
    id: user.id.toString(),
  });

  user.lastLoginedIn = utcTime;

  await user.save();

  res.set("Authorization", `Bearer ${AccessToken.accessToken}`);

  return res.status(200).json({
    data: {
      id: user.id,
      AccessToken: AccessToken.accessToken,
    },
    message: "User logged in successfully",
  });
};
