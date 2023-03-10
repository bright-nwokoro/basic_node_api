import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js"

const s3Service = new S3Service();

// export const createImage = async (req, res) => {
//   const userId = req.body.userid;
//   const profileImages = req.file ? req.file.key : "";

//   const user = await User.findOne({
//     id: userId,
//   });

//   if (!user) {
//     return res.status(400).json({
//       data: "",
//       message: "Invalid user",
//     });
//   }

//   user.profileImages = profileImages;
//   await user.save();

//   return res.status(200).json({
//     data: "",
//     message: "Image create successfully",
//   });
// };

export const fetchImageByKey = async (req, res) => {
  const key = req.query.key;

  const imageURL = await s3Service.generatePresignedUrl(key);

  // Temporary redirect to the generated URL
  res.redirect(302, imageURL);
};


// export const updateImageByUserId = async (req, res) => {
//   const userId = req.params.userid;
//   const profileImages = req.file ? req.file.key : "";

//   const user = await User.findOne({
//     id: userId,
//   });

//   if (!user) {
//     return res.status(400).json({
//       data: "",
//       message: "Invalid user",
//     });
//   }

//   if (req.file && user.profileImages) {
//     s3Service.deletes3Bucket(user.profileImages);
//   }

//   user.profileImages = profileImages;
//   await user.save();

//   return res.status(200).json({
//     data: "",
//     message: "Image updated successfully",
//   });
// };

// export const deleteImageByUserID = async (req, res) => {
//   const userId = req.parms.userid;

//   const user = await User.findOne({
//     id: userId,
//   });

//   if (!user) {
//     return res.status(404).json({
//       data: "",
//       message: "No user was found",
//     });
//   }

//   if (user.profileImages) {
//     s3Service.deletes3Bucket(user.profileImages);

//     user.profileImages = "";
//     await user.save();

//     return res.status(204).json({
//       data: "",
//       message: "Image deleted successfully",
//     });
//   }

//   return res.status(404).json({
//     data: "",
//     message: "No image was found for this user",
//   });
// };
