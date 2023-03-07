import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js"

const s3Service = new S3Service();

export const createImage = async (req, res) => {
  const userId = req.body.userid;
  const profileImage = req.file ? req.file.key : "";

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(400).json({
      data: "",
      message: "Invalid user",
    });
  }

  user.profileImage = profileImage;
  await user.save();

  return res.status(200).json({
    data: "",
    message: "Image create successfully",
  });
};

export const fetchImageByKey = async (req, res) => {
  const key = req.params.key;

  const imageURL = await s3Service.generatePresignedUrl(key);

  return res.status(200).json({
    data: imageURL,
    message: "Image retrieved successfully",
  });
};

export const updateImageByUserId = async (req, res) => {
  const userId = req.params.userid;
  const profileImage = req.file ? req.file.key : "";

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(400).json({
      data: "",
      message: "Invalid user",
    });
  }

  if (req.file && user.profileImage) {
    s3Service.deletes3Bucket(user.profileImage);
  }

  user.profileImage = profileImage;
  await user.save();

  return res.status(200).json({
    data: "",
    message: "Image updated successfully",
  });
};

export const deleteImageByUserID = async (req, res) => {
  const userId = req.parms.userid;

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "No user was found",
    });
  }

  if (user.profileImage) {
    s3Service.deletes3Bucket(user.profileImage);

    user.profileImage = "";
    await user.save();

    return res.status(204).json({
      data: "",
      message: "Image deleted successfully",
    });
  }

  return res.status(404).json({
    data: "",
    message: "No image was found for this user",
  });
};
