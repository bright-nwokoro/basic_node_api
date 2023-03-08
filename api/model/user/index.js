import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4().replace(/-/g, "").toLowerCase(),
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not_Entered"],
      default: "Not_Entered",
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
      required: [true, "Please enter an email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    profileImages: [String],
    dob: {
      type: String,
      validate: {
        validator: function (value) {
          const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
          return dobRegex.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid date of birth! Please use format YYYY-MM-DD.`,
      },
    },
    dogIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],
    lastLoginedIn: Date,
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.virtual("age").get(function () {
  const birthDate = new Date(this.dob);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if the user has not had their birthday yet this year
  const isBeforeBirthday =
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate());

  if (isBeforeBirthday) {
    age--;
  }

  return age;
});

const User = mongoose.model("User", userSchema);

export const swaggerUserSchema = m2s(User);
export default User;

// pagination, gender, enums, filter
// time utc
// image endpoint
