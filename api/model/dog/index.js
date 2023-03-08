import mongoose from "mongoose";
import m2s from "mongoose-to-swagger";
import { v4 as uuidv4 } from "uuid";

const dogSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4().replace(/-/g, "").toLowerCase(),
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter the dog's name"],
  },
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
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Not_Entered"],
    default: "Not_Entered",
  },
  profileImages: [String],
});

const Dog = mongoose.model("Dog", dogSchema);

export const swaggerDogSchema = m2s(Dog);
export default Dog;
