import connect from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    if (!requestBody)
      return NextResponse.json({
        "Request Body is Empty or Else Something Wrong": requestBody,
      });
    const { username, fullname, email, password } = requestBody;
    const user = await User.findOne({ email });
    if (user)
      return NextResponse.json(
        { Error: "User Already Exists" },
        { status: 400 }
      );
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const createUser = new User({
      username,
      fullname,
      email,
      password: hashPassword,
    });
    const createdUser = await createUser.save();
    console.log(createdUser);

    await sendEmail({ email, emailType: "VERIFY", userId: createdUser._id });
    return NextResponse.json(
      {
        message: "User Created SuccessFully",
        success: true,
        createdUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { "Error Occurs While Creating User": error.message },
      { status: 500 }
    );
  }
}
