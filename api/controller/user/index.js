import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js";

const s3Service = new S3Service();

export const createUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const gender = req.body.gender;
  const dob = req.body.dob;

  if (!email || !password) {
    return res.status(400).json({
      data: "",
      message: "You cant create a new user without an email and password",
    });
  }

  await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    password: password,
    dob: dob,
  })
    .then((user) => {
      return res.status(201).json({
        data: user,
        message: "User profile created successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        data: err.message,
        message: "Unable to create new user",
      });
    });
};

export const getAllUser = async (req, res) => {
  const user = await User.find({});

  return res.status(200).json({
    data: user,
    message: "All user has been successfully retrieved",
  });
};

export const fetchUserProfileByID = async (req, res) => {
  const id = req.params.userid;
  const summary = req.query.summary;
  const full = req.query.full;

  const user = await User.findOne({
    id: id,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "No user was found",
    });
  }

  if (summary === "true") {
    return res.status(200).json({
      data: {
        fullName: user.fullName,
        imageURI: user.profileImage,
      },
      message: "Summary of User profile retrieved successfully",
    });
  }

  if (full === "true") {
    return res.status(200).json({
      data: user,
      message: "Full User profile retrieved successfully",
    });
  }

  return res.status(200).json({
    data: user,
    message: "User profile retrieved successfully",
  });
};

export const updateUserProfileByID = async (req, res) => {
  const id = req.params.userid;

  const user = await User.findOne({
    id: id,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "No user was found",
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const gender = req.body.gender;
  const dob = req.body.dob;

  user.email = email ? email : user.email;
  user.password = password ? password : user.password;
  user.firstName = firstName ? firstName : user.firstName;
  user.lastName = lastName ? lastName : user.lastName;
  user.gender = gender ? gender : user.gender;
  user.dob = dob ? dob : user.dob;

  await user.save().then((user) => {
    return res.status(200).json({
      data: user,
      message: "User profile updated successfully",
    });
  });
};

export const deleteUserProfileByID = async (req, res) => {
  const id = req.params.userid;

  const user = await User.findOne({
    id: id,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "No user was found",
    });
  }

  await User.deleteOne({
    id: id,
  })
    .then(() => {
      return res.status(200).json({
        data: "",
        message: "User delete updated successfully",
      });
    })
    .catch(() => {
      return res.status(500).json({
        data: "",
        message: "Unable to delete User profile",
      });
    });
};

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortDirection = "desc",
      age,
      gender,
      lastLoggedInStart,
      lastLoggedInEnd,
      fullName,
    } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    const sort = {};
    const filters = [];

    // handle sorting
    sort[sortField] = sortDirection === "asc" ? 1 : -1;

    // handle filtering
    if (age) {
      const birthYear = new Date().getFullYear() - age;
      filters.push({ dob: { $lte: `${birthYear}-12-31` } });
      filters.push({ dob: { $gte: `${birthYear}-01-01` } });
    }
    if (gender) {
      filters.push({ gender: { $in: gender.split(",") } });
    }
    if (lastLoggedInStart) {
      filters.push({ lastLoginedIn: { $gte: new Date(lastLoggedInStart) } });
    }
    if (lastLoggedInEnd) {
      filters.push({ lastLoginedIn: { $lte: new Date(lastLoggedInEnd) } });
    }
    if (fullName) {
      filters.push({
        $or: [
          { firstName: new RegExp(fullName, "i") },
          { lastName: new RegExp(fullName, "i") },
        ],
      });
    }

    // execute the query
    const [users, totalCount] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort(sort),
      User.countDocuments(query),
    ]);

    // calculate page and pageCount
    const pageCount = Math.ceil(totalCount / limit);

    res.status(200).json({
      page,
      pageCount,
      totalCount,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserImage = async (req, res) => {
  const userId = req.params.userid;
  const profileImage = req.file ? req.file.key : "";

  const user = await User.findOne({
    id: userId,
  });

  if (!req.file) {
    return res.status(400).json({
      data: "",
      message: "Unsupported Image format.",
    });
  }

  if (!user) {
    return res.status(400).json({
      data: "",
      message: "Invalid user",
    });
  }

  user.profileImage = profileImage;
  await user.save();

  return res.status(200).json({
    data: req.file.key,
    message: "Image create successfully",
  });
};

export const getUserImage = async (req, res) => {
  const userId = req.params.userid;

  const user = await User.findOne({
    id: userId,
  });

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "User not found",
    });
  }

  if (!user.profileImage || user.profileImage.length < 0) {
    return res.status(404).json({
      data: "",
      message: "No image was found for this user",
    });
  }

  const imageURL = await s3Service.generatePresignedUrl(user.profileImage);

  return res.status(200).json({
    data: {
      imagekey: user.profileImage,
      presignedurl: imageURL,
    },
    message: "Image retrieved successfully",
  });
};

export const updateUserImage = async (req, res) => {
  const userId = req.body.userid;
  const profileImage = req.file ? req.file.key : "";

  const user = await User.findOne({
    id: userId,
  });

  if (!req.file) {
    return res.status(400).json({
      data: "",
      message: "Unsupported Image format.",
    });
  }

  if (!user) {
    return res.status(404).json({
      data: "",
      message: "User not found",
    });
  }

  if (req.file && user.profileImage) {
    s3Service.deletes3Bucket(user.profileImage);
  }

  user.profileImage = profileImage;
  await user.save();

  return res.status(200).json({
    data: req.file.key,
    message: "Image create successfully",
  });
};

export const deleteUserImage = async (req, res) => {
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
