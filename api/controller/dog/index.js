import Dog from "../../model/dog/index.js";
import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js";

const s3Service = new S3Service();

export const newDog = async (req, res) => {
  const userId = req.body.userid;
  const name = req.body.name;
  const dob = req.body.dob;
  const gender = req.body.gender;

  if (!userId) {
    return res.status(400).json({
      data: "",
      message: "User id is required",
    });
  }

  if (!name) {
    return res.status(400).json({
      data: "",
      message: "You cant create a new dog without a name",
    });
  }

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "User not found",
    });
  }

  try {
    const dog = new Dog({
      name: name,
      gender: gender,
      dob: dob,
    });

    await dog.save().then(async () => {
      user.dogIds.push(dog._id);
      await user.save();
    });

    return res.status(201).json({
      data: dog,
      message: "Dog profile created for user successfully",
    });
  } catch (error) {
    return res.status(400).json({
      data: "",
      message: error.message,
    });
  }
};

export const fetchDogProfileByUserID = async (req, res) => {
  const userId = req.params.userid;

  const user = await User.findOne({
    id: userId,
  }).populate("dogIds");

  if (!user) {
    return res.status(400).json({
      data: "",
      message: "Invalid user id",
    });
  }

  return res.status(200).json({
    data: user,
    message: "Dog belonging to user's profile retrieved successfully",
  });
};

export const fetchDogID = async (req, res) => {
  const id = req.params.id;

  const dog = await Dog.find({
    id: id,
  });

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "No dog was found for this user",
    });
  }

  return res.status(200).json({
    data: dog,
    message: "Dog profile retrieved successfully",
  });
};

export const updateDogByID = async (req, res) => {
  const id = req.params.id;

  const dog = await Dog.findOne({
    id: id,
  });

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "No dog was found",
    });
  }

  const name = req.body.name;
  const gender = req.body.gender;
  const dob = req.body.dob;

  dog.name = name ? name : dog.name;
  dog.gender = gender ? gender : dog.gender;
  dog.dob = dob ? dob : dog.dob;

  await dog.save().then((dog) => {
    return res.status(200).json({
      data: dog,
      message: "Dog profile updated successfully",
    });
  });
};

export const deleteDogProfileByID = async (req, res) => {
  const id = req.params.id;

  const dog = await Dog.findOne({
    id: id,
  });

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "No dog was found",
    });
  }

  await Dog.deleteOne({
    id: id,
  })
    .then(() => {
      return res.status(200).json({
        data: "",
        message: "Dog delete updated successfully",
      });
    })
    .catch(() => {
      return res.status(500).json({
        data: "",
        message: "Unable to delete Dog profile",
      });
    });
};

export const createDogImage = async (req, res) => {
  const dogId = req.body.dogid;
  const profileImages = req.files ? req.files.map((file) => file.key) : "";

  const dog = await Dog.findOne({
    id: dogId,
  });

  if (!req.files) {
    return res.status(400).json({
      data: "",
      message: "Unsupported Image format.",
    });
  }

  if (!dog) {
    return res.status(400).json({
      data: "",
      message: "Invalid dog",
    });
  }

  dog.profileImages = profileImages;
  await dog.save();

  return res.status(200).json({
    data: profileImages,
    message: "Image create successfully",
  });
};

export const getDogImage = async (req, res) => {
  const dogId = req.params.dogid;

  const dog = await Dog.findOne({
    id: dogId,
  });

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "Dog not found",
    });
  }

  if (!dog.profileImages || dog.profileImages.length < 0) {
    return res.status(404).json({
      data: "",
      message: "No image was found for this dog",
    });
  }

  const images = dog.profileImages;
  const imageURLs = [];

  for (const image of images) {
    imageURLs.push(await s3Service.generatePresignedUrl(image));
  }

  return res.status(200).json({
    data: {
      imagekey: dog.profileImages,
      presignedurl: imageURLs,
    },
    message: "Image retrieved successfully",
  });
};

export const updateDogImage = async (req, res) => {
  const dogId = req.body.dogid;
  const previousImageKey = req.body.previousimagekey;
  const newImageKey = req.file ? req.file.key : null;

  const dog = await Dog.findOne({
    id: dogId,
  });

  if (!previousImageKey) {
    return res.status(400).json({
      data: "",
      message: "Please include previous image key.",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      data: "",
      message: "Unsupported Image format.",
    });
  }

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "Dog not found",
    });
  }

  if (dog.profileImages) {
    const index = dog.profileImages.findIndex(
      (key) => key === previousImageKey
    );
    if (index !== -1) {
      s3Service.deletes3Bucket([previousImageKey]);
      dog.profileImages.splice(index, 1, newImageKey);
    } else {
      dog.profileImages.push(newImageKey);
    }
  } else {
    dog.profileImages = [newImageKey];
  }

  await dog.save();

  return res.status(200).json({
    data: newImageKey,
    message: "Image updated successfully",
  });
};

export const deleteDogImage = async (req, res) => {
  const dogId = req.parms.dogid;

  const dog = await Dog.findOne({
    id: dogId,
  });

  if (!dog) {
    return res.status(404).json({
      data: "",
      message: "No dog was found",
    });
  }

  if (dog.profileImages) {
    s3Service.deletes3Bucket(`dogs/${dogId}`);

    dog.profileImages = "";
    await dog.save();

    return res.status(204).json({
      data: "",
      message: "Image deleted successfully",
    });
  }

  return res.status(404).json({
    data: "",
    message: "No image was found for this dog",
  });
};
