import express from "express";

import S3Service from "../../middlewares/aws/s3/multer.js";

import { authMiddleware } from "../../middlewares/auth/index.js";
import {
  signup,
  fetchUserProfileByID,
  updateUserProfileByID,
  deleteUserProfileByID,
  getUsers,
} from "../../controller/user/index.js";

const s3Service = new S3Service();
const upload = s3Service.getMulterUploadMiddleware();

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: GET user by QUERIES
 *     description: GET new user by QUERIES
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: age
 *         description: Age
 *         type: string
 *       - in: query
 *         name: gender
 *         description: Gender
 *         type: string
 *       - in: query
 *         name: lastLoggedInStart
 *         description: Last LoggedIn Start
 *         type: string
 *       - in: query
 *         name: lastLoggedInEnd
 *         description: Last LoggedIn End
 *         type: string
 *       - in: query
 *         name: fullName
 *         description: Full Name
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been retrieved successfully
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been retrieved successfully
 *       204:
 *         description: No Content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been retrieved successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Custom error message
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Not Found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Server error
 * */
router.get("/", authMiddleware, getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: GET user
 *     description: GET new user
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         type: string
 *         required: true
 *       - in: query
 *         name: summary
 *         description: Summary of User Information. Enter true or false
 *         type: string
 *       - in: query
 *         name: full
 *         description: Full User Information. Enter true or false
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       204:
 *         description: No Content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Custom error message
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Not Found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Server error
 * */
router.get("/:id", authMiddleware, fetchUserProfileByID);

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: CREATE new user
 *     description: CREATE new user
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *                   - Others
 *               dob:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       204:
 *         description: No Content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Custom error message
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Not Found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Server error
 * */
router.post("/signup", upload.single("profileImage"), signup);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: UPDATE user
 *     description: UPDATE user
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
 *                   - Others
 *               dob:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been updated successfully
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been updated successfully
 *       204:
 *         description: No Content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Custom error message
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Not Found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Server error
 * */
router.put(
  "/:id",
  authMiddleware,
  upload.single("profileImage"),
  updateUserProfileByID
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: DELETE user
 *     description: DELETE user
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       204:
 *         description: No Content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: User profile has been created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Custom error message
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Not Found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *             example:
 *               data: {}
 *               message: Server error
 * */
router.delete("/:id", authMiddleware, deleteUserProfileByID);

export default router;
