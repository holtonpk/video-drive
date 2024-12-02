import {Storage} from "@google-cloud/storage";
import {NextResponse} from "next/server";
import {PassThrough} from "stream";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

export const maxDuration = 300;

const ffmpegPath = path.resolve(
  process.cwd(),
  "node_modules",
  "ffmpeg-static",
  "ffmpeg"
);

ffmpeg.setFfmpegPath(ffmpegPath);

const convertVideoToAudio = async (fileName: string) => {
  if (!fileName) {
    throw new Error("Invalid file name provided.");
  }

  try {
    const bucketName = "video-drive-8d636.appspot.com";
    const filePath = `${fileName}`;
    const outputFileName = `audio/${fileName.replace(
      /\.[^/.]+$/,
      ""
    )}-audio.mp3`;

    // Initialize Firebase Storage
    const storage = new Storage({
      projectId: "video-drive-8d636",
      credentials: credentials,
    });

    const bucket = storage.bucket(bucketName);

    // Get a signed URL for the video file
    const [videoUrl] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    const passThrough = new PassThrough();

    // Prepare the write stream for the output file
    const uploadStream = bucket.file(outputFileName).createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
      resumable: false,
    });

    const uploadPromise = new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    // Convert the video to audio using FFmpeg
    ffmpeg()
      .input(videoUrl)
      .outputOptions("-ab", "192k")
      .toFormat("mp3")
      .pipe(passThrough)
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent?.toFixed(2) || 0}% done`);
      })
      .on("end", () => {
        console.log("FFmpeg conversion finished.");
      })
      .on("error", (error) => {
        console.error("FFmpeg error:", error);
        uploadStream.end(); // Ensure the stream is closed
      });

    passThrough.pipe(uploadStream);

    // Wait for the upload to complete
    await uploadPromise;

    console.log("Conversion successful. Output file:", outputFileName);

    // Return the output file name when done
    return outputFileName;
  } catch (error) {
    console.error("Error during conversion:", error);
    throw error;
  }
};

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const fileName = requestData.fileName;

    const audioFile = await convertVideoToAudio(fileName);

    console.log("audioFile", audioFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/convert-audio-to-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName: audioFile}),
      }
    );

    const data = await response.json();

    // Assuming getTextFromJSON returns a promise that resolves with the extracted text
    const transcription = data.text;

    return NextResponse.json({success: true, text: transcription});
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({success: false, error: error.message});
  }
}

export async function GET() {
  try {
    const fileName = `test.mp4`;
    const audioFile = await convertVideoToAudio(fileName);

    console.log("audioFile", audioFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/convert-audio-to-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({fileName: audioFile}),
      }
    );

    const data = await response.json();

    // Assuming getTextFromJSON returns a promise that resolves with the extracted text
    const text = data.text;

    return NextResponse.json({success: true, text: text});
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({success: false, error: error.message});
  }
}

const credentials = {
  type: "service_account",
  project_id: "video-drive-8d636",
  private_key_id: "e327a1c537b2a6c44571ae3270bb2833e0f1ae03",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbfRyR5LLs7obG\nqtcS2pBPZ76vBHSA546rQnt/xG5hrQVce1Sv+GjERK0hfDfWrYEs/IwY6OnimL11\nEV90wHu7/pZXxLZa5QP8dHS1o9XimPgyD3m4i6ozdR1vTdvfEu1o1et3bNVlInC+\nWfxP7QfzFYilpeNwzu0cLKx1PSB+u6FAE2Q5y1thwfvqToanxRMauQuVZliVC2JL\nsLFVdGNrdnCfXdA53PYWuxucJgS3AEWH+5xK6KEoRwXAf0bvaPRpd0cBhVLXusGR\nO81Os0ayjhw1PpfzO2LIz4jYE8gG7dN+5lM9JL2CRqo/IDXhoPwkaK85XQVg0wt8\n1ckp+IjjAgMBAAECggEAA0s1sTnk6zosUB+rWa9k/wGfTpBrsi71kAqWMieXmc/m\nY3lxwR6KhAN00j14gCUBx2tI9N6H1QocrVLjMKzcXvTU+3v9ZVSHocmK9WDiNYaK\nPDxx41ppQX8zUrnIzn0Ip9lfcqxM1ia4hUr25zyJ5N9DNOGCo8+f9aJVCIP1R10q\ntXkKxqMIvBxMDbl00NyLehj5yutrcQJjb6GbBtAt2qnL8W2XUUb/L+IW2lqt9Eu0\nDErjbcplwx+4+8DIH36iJxYm8UoVBe6S188OIWYuIRQCf3Ho6OYm40+2PcNH20JI\ncAGRmrZwxAZtq+ogzPZFK4kbRlCtChJctKyzg96AJQKBgQDHon7JdlodB7l8qn0w\nNgKqGujRb4SXIaFLUe/qguU/4OP2fWKexX6mjuNA1Ijo0hfByu1AH99NgPNVLUml\nzpMn4oCcQ+w3qRRSuauStWWRfOepRPLkaPr9ZjcKbsljgxprZQ/dmP0guxDegaQo\n6p+gGAcNqELPLmmn+2pEx3hvFwKBgQDHY8MjPYyKKwF6ZUkdhHI6Cy5YhOscoWEe\nn96jc5MXShjiPUjHj32gx7kb2IkU7bGE3TVbNo5z2HjKEDgtswi4klcL6Sq0ZWYG\n/gLAWeyGV94H8NQ887KPMeoitvk3jSYqSuxh7reTeO8nTex5tM/OTOgXpsKFM+ev\n6dMwC+d0FQKBgE/BzNOiNBhbCLEU0BUdzuy0+YUK/7b9mZok7ywLBZoCuDC3IVp7\nXsEeXw58mwIhRZqH/0daNHWbahwCjuTuZf5OUMGdpVcLdvIh+bkQPbblZwxKXpwA\nkR4B40WIw269ZyW256LJx393HSM4OiSasBFe6Bp9uctaKJ4TJP67jpMbAoGBAJnA\nK/E4vO6uSu1+vOqt/wcTKCHKHSJurt1Wme+gZ4RF9vo+F6kK1OzuFaeLSemBgKnb\nihFT+HUML9hguXFD5S2uasEcg3mn1wz9QlHhBapyhxvIcWCu6rnQ26L5RSO5C/0A\n2VaLJbPqRUAhroALFVMXqsDSLp1YcQgNXnRmOYwhAoGBAMO2SZiii833a5lieA/i\n4f9Tav41e/KmDSCTB5V3O5SHo3tB8DkY20UDAq9IpHbyBxc+nI1mZO42cNLRr7fS\nMt+Fd25ZBC+6pYixz0T3kLbsbb6mMAQyjwJN3shXNK+Y5IUIMA5nmstI9/HcsF8H\n8xhV/eAeJiYtlCAXnXpXe+9J\n-----END PRIVATE KEY-----\n",
  client_email: "storage@video-drive-8d636.iam.gserviceaccount.com",
  client_id: "104521323663027552210",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/storage%40video-drive-8d636.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// // Usage

// export async function GET() {
//   try {
//     // Imports the Google Cloud client libraries
//     const speech = require("@google-cloud/speech").v1p1beta1;

//     // Creates a client

//     const bucketName = "ai-teacher-79270.appspot.com";
//     const fileName = "dr61s6";
//     const gcsSourceUri = `gs://${bucketName}/${fileName}`;

//     // const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
//     const model = "video";
//     const encoding = "MP3";
//     const sampleRateHertz = 16000;
//     const languageCode = "en-US";

//     const config = {
//       encoding: encoding,
//       sampleRateHertz: sampleRateHertz,
//       languageCode: languageCode,
//       model: model,
//     };
//     const audio = {
//       uri: gcsSourceUri,
//     };

//     const request = {
//       config: config,
//       audio: audio,
//     };

//     // Detects speech in the audio file.
//     const [operation] = await client.longRunningRecognize(request);
//     const [response] = await operation.promise();

//     const transcription = response.results
//       .map((result) => result.alternatives[0].transcript)
//       .join("\n");
//     console.log("Transcription: ", transcription);

//     return NextResponse.json({
//       success: true,
//       result: JSON.stringify(response.results),
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({sucess: false});
//   }
// }
