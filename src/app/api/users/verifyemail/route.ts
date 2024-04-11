import connect from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    if (!requestBody)
      return NextResponse.json({
        "Request Body is Empty or Else Something Wrong": requestBody,
      });
    const { token } = requestBody;
    console.log(token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return NextResponse.json({ message: "Token Not Valid" }, { status: 400 });
    user.isVarified = true;
    user.varifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email Varified Successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { "Error Occurs While Verifying Email": error.message },
      { status: 500 }
    );
  }
}
