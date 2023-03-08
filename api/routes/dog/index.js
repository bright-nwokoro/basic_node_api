import express from "express";

import S3MulterService from "../../middlewares/multer.js";

// import { authMiddleware } from "../../middlewares/auth/index.js";
import {
  newDog,
  fetchDogProfileByUserID,
  fetchDogID,
  updateDogByID,
  deleteDogProfileByID,
  createDogImage,
  getDogImage,
  updateDogImage,
  deleteDogImage
} from "../../controller/dog/index.js";

const router = express.Router();

const s3Service = new S3MulterService();
const upload = s3Service.getMulterUploadMiddleware();

/**
 * @swagger
 * /dog/create:
 *   post:
 *     summary: CREATE new dog
 *     description: CREATE new dog
 
 *     tags:
 *       - Dog
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userid
 *               - name
 *             properties:
 *               userid:
 *                 type: string
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
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
 *               message: Dog profile has been created successfully
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
 *               message: Dog profile has been created successfully
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
router.post(
  "/create",
  // authMiddleware,
  newDog
);

/**
 * @swagger
 * /dog/users/{userid}:
 *   get:
 *     summary: GET dog
 *     description: GET new dog
 
 *     tags:
 *       - Dog
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
 *               message: Dog profile has been created successfully
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
  "/users/:userid",
  // authMiddleware,
  fetchDogProfileByUserID
);

/**
 * @swagger
 * /dog/{id}:
 *   get:
 *     summary: GET dog by ID
 *     description: GET dog by ID
 
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Dog ID
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
  "/:id",
  // authMiddleware,
  fetchDogID
);

/**
 * @swagger
 * /dog/{id}:
 *   put:
 *     summary: UPDATE dog
 *     description: UPDATE dog
 
 *     tags:
 *       - Dog
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum:
 *                   - Male
 *                   - Female
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
  // authMiddleware,
  updateDogByID
);

/**
 * @swagger
 * /dog/{id}:
 *   delete:
 *     summary: DELETE dog
 *     description: DELETE dog
 
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Dog ID
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
 *               message: Dog profile has been created successfully
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
 *               message: Dog profile has been created successfully
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
 *               message: Dog profile has been created successfully
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
router.delete(
  "/:id",
  // authMiddleware,
  deleteDogProfileByID
);

/**
 * @swagger
 * /dog/{dogid}/image:
 *   post:
 *     summary: CREATE new images for dog
 *     description: CREATE new images for dog
 
 *     tags:
 *       - Dog
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - dogid
 *               - dogs
 *             properties:
 *               userid:
 *                 type: string
 *               dogs:
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
router.post("/:dogid/image", upload.array("dogs"), createDogImage);

/**
 * @swagger
 * /dog/{dogid}/image:
 *   get:
 *     summary: GET image
 *     description: GET new image
 
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: dogid
 *         description: Dog ID
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
  "/:dogid/image",
  // authMiddleware,
  getDogImage
);

/**
 * @swagger
 * /dog/{dogid}/image:
 *   put:
 *     summary: UPDATE dog image
 *     description: UPDATE dog image
 
 *     tags:
 *       - Dog
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - dogs
 *               - previousimagekey
 *             properties:
 *               previousimagekey:
 *                 type: string
 *               dogs:
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
  "/:dogid/image",
  // authMiddleware,
  upload.single("dogs"),
  updateDogImage
);

/**
 * @swagger
 * /dog/{dogid}/image:
 *   delete:
 *     summary: DELETE Image 
 *     description: DELETE Image
 
 *     tags:
 *       - Dog
 *     parameters:
 *       - in: path
 *         name: dogid
 *         description: Dog ID
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
 *               message: Dog profile iamge has been deleted successfully
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
  deleteDogImage
);

export default router;
