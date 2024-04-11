import mongoose, { connection } from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    connection.on("connection", () => {
      console.log("DataBase Connected");
    });
    connection.on("error", (err) => {
      console.log("Not Connected .." + err);
      process.exit();
    });
  } catch (error) {
    console.log("Error Occurs while Connecting DB", error);
  }
}
