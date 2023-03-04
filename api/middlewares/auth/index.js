import {
  authenticateUserToken,
  generateUserAccessToken,
  setUserAuthResHeader,
} from "./auth_token.js";

export { authenticateUserToken, generateUserAccessToken, setUserAuthResHeader };

export const authMiddleware = [
  authenticateUserToken,
  setUserAuthResHeader,
];
