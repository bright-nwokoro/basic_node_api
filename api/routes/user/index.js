import express from "express";

import S3MulterService from "../../middlewares/multer.js";

// import { authMiddleware } from "../../middlewares/auth/index.js";
import {
  createUser,
  getAllUser,
  fetchUserProfileByID,
  updateUserProfileByID,
  deleteUserProfileByID,
  getUsers,
  createUserImage,
  getUserImage,
  updateUserImage,
  deleteUserImage,
} from "../../controller/user/index.js";

const s3Service = new S3MulterService();
const upload = s3Service.getMulterUploadMiddleware();

const router = express.Router();

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: GET All user
 *     description: GET All user
 
 *     tags:
 *       - User
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
 * */
router.get(
  "/all",
  // authMiddleware,
  getAllUser
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: GET user by QUERIES
 *     description: GET new user by QUERIES
 
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
 *       - in: query
 *         name: format
 *         description: Summary/Full
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
router.get(
  "/",
  // authMiddleware,
  getUsers
);

// /**
//  * @swagger
//  * /user/{userid}:
//  *   get:
//  *     summary: GET user
//  *     description: GET new user
 
//  *     tags:
//  *       - User
//  *     parameters:
//  *       - in: path
//  *         name: userid
//  *         description: User ID
//  *         type: string
//  *         required: true
//  *       - in: query
//  *         name: summary
//  *         description: Summary of User Information. Enter true or false
//  *         type: string
//  *       - in: query
//  *         name: full
//  *         description: Full User Information. Enter true or false
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Success
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                 message:
//  *                   type: string
//  *             example:
//  *               data: {}
//  *               message: User profile has been created successfully
//  *       400:
//  *         description: Bad request
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                 message:
//  *                   type: string
//  *             example:
//  *               data: {}
//  *               message: Custom error message
//  *       404:
//  *         description: Not Found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                 message:
//  *                   type: string
//  *             example:
//  *               data: {}
//  *               message: Not Found
//  * */
// router.get(
//   "/:userid",
//   // authMiddleware,
//   fetchUserProfileByID
// );

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: CREATE new user
 *     description: CREATE new user
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         application/json:
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
 * */
router.post("/create", createUser);

/**
 * @swagger
 * /user/{userid}:
 *   put:
 *     summary: UPDATE user
 *     description: UPDATE user
 
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userid
 *         description: User ID
 *         type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
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
 * */
router.put(
  "/:userid",
  // authMiddleware,
  updateUserProfileByID
);

/**
 * @swagger
 * /user/{userid}:
 *   delete:
 *     summary: DELETE user
 *     description: DELETE user
 
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userid
 *         description: User ID
 *         type: string
 *         required: true
 *     responses:
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
 * */
router.delete(
  "/:userid",
  // authMiddleware,
  deleteUserProfileByID
);

/**
 * @swagger
 * /user/{userid}/image:
 *   post:
 *     summary: CREATE new images for user
 *     description: CREATE new images for user
 
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - users
 *             properties:
 *               userid:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *               message: Image has been created successfully
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
 *               message: Image has been created successfully
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
 *               message: Image has been created successfully
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
 * */
router.post("/:userid/image", upload.array("users"), createUserImage);

/**
 * @swagger
 * /user/{userid}/image:
 *   get:
 *     summary: GET image
 *     description: GET new image
 
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userid
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
 *               message: Image has been retrieved successfully
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
 * */
router.get(
  "/:userid/image",
  // authMiddleware,
  getUserImage
);

/**
 * @swagger
 * /user/{userid}/image:
 *   put:
 *     summary: UPDATE user image
 *     description: UPDATE user image
 
 *     tags:
 *       - User
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *               - previousimagekey
 *             properties:
 *               previousimagekey:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *               message: Image has been updated successfully
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
 * */
router.put(
  "/:userid/image",
  // authMiddleware,
  upload.single("users"),
  updateUserImage
);

/**
 * @swagger
 * /user/{userid}/image:
 *   delete:
 *     summary: DELETE Image 
 *     description: DELETE Image
 
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userid
 *         description: User ID
 *         type: string
 *         required: true
 *     responses:
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
 * */
router.delete(
  "/:userid/image",
  // authMiddleware,
  deleteUserImage
);

export default router;
