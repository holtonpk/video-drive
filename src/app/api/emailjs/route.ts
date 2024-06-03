import {NextResponse} from "next/server";
import emailjs from "@emailjs/browser";
import axios from "axios";

export async function POST(req: Request) {
  const {emailTemp} = await req.json();

  try {
    const email = await emailjs.send(
      "service_xh39zvd",
      "template_7ccloj9",
      emailTemp,
      "Vfdmt28c91yq6Fz-G"
    );

    return NextResponse.json({
      response: email,
    });
  } catch (error) {
    return NextResponse.json({
      erorr: error,
    });
  }
}

export async function GET() {
  try {
    const emailTemp = {
      subject: `Patrick marked video test as test`,
      line_1: `The status of video test has been updated 
      to test`,
      line_2: "Please review the video and provide feedback",
      action_url: `https://video-drive.vercel.app/video/1071`,
      to_email: "holtonpk@gmail.com",
    };

    const emailData = {
      service_id: "service_xh39zvd",
      template_id: "template_7ccloj9",
      user_id: "_xxtFZFU5RPJivl-9",
      template_params: emailTemp,
      accessToken: "rIezh-MOZPAh3KEMZWpa_",
    };

    try {
      await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return NextResponse.json({
      response: "Success",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      erorr: error,
    });
  }
}
