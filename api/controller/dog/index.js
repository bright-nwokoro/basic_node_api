import Dog from "../../model/dog/index.js";
import User from "../../model/user/index.js";
// import S3Service from "../../utils/s3/index.js"

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

  await Dog.create({
    name: name,
    userId: user._id,
    gender: gender,
    dob: dob,
  })
    .then((dog) => {
      return res.status(201).json({
        data: dog,
        message: "Dog profile created for user successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        data: err.message,
        message: "Unable to create new dog",
      });
    });
};

export const fetchDogProfileByUserID = async (req, res) => {
  const userId = req.params.userid;

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(400).json({
      data: "",
      message: "Invalid user id",
    });
  }

  const dog = await Dog.find({
    userId: user._id,
  }).populate("userId");

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

export const fetchDogID = async (req, res) => {
  const id = req.params.id;

  console.log(id);

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
