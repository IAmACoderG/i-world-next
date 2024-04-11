import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 6000000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 6000000,
      });
    }
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5bdd7358a3a47c",
        pass: "90816d022b12c9",
      },
    });

    const forVerification = `<p>
      Click 
      <a href="${process.env.DOMAIN}/verifyemail?token=${hashToken}">Here</a>
      to 
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below on your browser.
      <br>
      ${process.env.DOMAIN}/verifyemail?token=${hashToken} 
      </p>`;

    const info = {
      from: "rajaryanitshot@gmail.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "verify your email" : "reset your password", // Subject line
      html: forVerification, // html body
    };
    const mailResponse = await transport.sendMail(info);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
