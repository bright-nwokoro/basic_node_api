import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { v4 as uuidv4 } from "uuid";

const dogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4().replace(/-/g, "").toLowerCase(),
    unique: true,
  },
  name: String,
  dob: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Not_Entered"],
    default: "Not_Entered",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Dog = mongoose.model("Dog", dogSchema);

export const swaggerDogSchema = m2s(Dog);
export default Dog;
