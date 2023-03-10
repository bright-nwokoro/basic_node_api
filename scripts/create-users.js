import mongoose from "mongoose";
import User from "../api/model/user/index.js";

const dbURI = "mongodb://admin:password@mongo:27017";

mongoose.set("strictQuery", true);
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createUsers = async () => {
  try {
    const users = [
      {
        firstName: "Alice",
        lastName: "Hey",
        email: "alice@example.com",
        password: "password1",
      },
      {
        firstName: "Bob",
        lastName: "Hi",
        email: "bob@example.com",
        password: "password2",
      },
      {
        firstName: "Charlie",
        lastName: "Hello",
        email: "charlie@example.com",
        password: "password3",
      },
    ];

    await User.insertMany(users);

    // for (const user of users) {
    //   const user_ = new User({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //     password: user.password,
    //   });

    //   await user_.save();
    // }

    console.log("Users created successfully");
    mongoose.connection.close();
  } catch (error) {
    console.log({
      error: error,
      message: "error creating user",
    });
    mongoose.connection.close();
  }
};

createUsers();
