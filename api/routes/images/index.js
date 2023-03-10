import express from "express";

import S3MulterService from "../../middlewares/multer.js";

// import { authMiddleware } from "../../middlewares/auth/index.js";
import {
  //   createImage,
  fetchImageByKey,
  //   updateImageByUserId,
  //   deleteImageByUserID,
} from "../../controller/images/index.js";

const s3Service = new S3MulterService();
// const upload = s3Service.getMulterUploadMiddleware();

const router = express.Router();

// /**
//  * @swagger
//  * /images/create:
//  *   post:
//  *     summary: CREATE new images for user
//  *     description: CREATE new images for user

//  *     tags:
//  *       - Image
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - userid
//  *             properties:
//  *               userid:
//  *                 type: string
//  *               profileImages:
//  *                 type: string
//  *                 format: binary
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
//  *               message: Image has been created successfully
//  *       201:
//  *         description: Created
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
//  *               message: Image has been created successfully
//  *       204:
//  *         description: No Content
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
//  *               message: Image has been created successfully
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
//  *       500:
//  *         description: Server error
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
//  *               message: Server error
//  * */
// router.post("/create", upload.single("profileImages"), createImage);

/**
 * @swagger
 * /images/{key}:
 *   get:
 *     summary: Redirects to another Image URL
 *     description: Redirects to another URL
 
 *     tags:
 *       - Image
 *     parameters:
 *       - in: query
 *         name: key
 *         description: Key
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
 *       302:
 *         description: Temp Redirect
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
 *               message: Redirecting
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
router.get(
  "/",
  // authMiddleware,
  fetchImageByKey
);

// /**
//  * @swagger
//  * /user/{id}:
//  *   put:
//  *     summary: UPDATE user
//  *     description: UPDATE user

//  *     tags:
//  *       - User
//  *     requestBody:
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - userid
//  *             properties:
//  *               userid:
//  *                 type: string
//  *               profileImages:
//  *                 type: string
//  *                 format: binary
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
//  *               message: Image has been updated successfully
//  *       201:
//  *         description: Created
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
//  *               message: Image has been updated successfully
//  *       204:
//  *         description: No Content
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
//  *               message: Image has been created successfully
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
//  *       500:
//  *         description: Server error
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
//  *               message: Server error
//  * */
// router.put(
//   "/:userid",
//   authMiddleware,
//   upload.single("profileImages"),
//   updateImageByUserId
// );

// /**
//  * @swagger
//  * /images/{id}:
//  *   delete:
//  *     summary: DELETE Image
//  *     description: DELETE Image

//  *     tags:
//  *       - Image
//  *     parameters:
//  *       - in: path
//  *         name: userid
//  *         description: User ID
//  *         type: string
//  *         required: true
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
//  *       201:
//  *         description: Created
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
//  *       204:
//  *         description: No Content
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
//  *       500:
//  *         description: Server error
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
//  *               message: Server error
//  * */
// router.delete("/:userid", authMiddleware, deleteImageByUserID);

export default router;
