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
    firstName: String,
    lastName: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not_Entered"],
      default: "Not_Entered",
    },
    email: {
      type: String,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profileImage: String,
    dob: String,
    lastLoginedIn: Date,
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.virtual("age").get(function () {
  const birthYear = new Date(this.dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
});

const User = mongoose.model("User", userSchema);

export const swaggerUserSchema = m2s(User);
export default User;

// pagination, gender, enums, filter
// time utc
// image endpoint
