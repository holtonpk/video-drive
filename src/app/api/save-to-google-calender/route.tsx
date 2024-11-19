import {NextResponse} from "next/server";

const eventDummy = {
  summary: "Google I/O 2015",
  description: "A chance to hear more about Google's developer products.",
  start: {
    dateTime: "2024-11-18T17:26:00-06:00", // Adjusted for Central Standard Time (CST)
    timeZone: "America/Chicago",
  },
  end: {
    dateTime: "2024-11-18T18:26:00-06:00", // Adjusted for Central Standard Time (CST)
    timeZone: "America/Chicago",
  },
  //   recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
  reminders: {
    useDefault: false,
    overrides: [
      {method: "email", minutes: 10},
      {method: "popup", minutes: 10},
    ],
  },
};

export async function POST(req: Request) {
  const {accessToken, event} = await req.json();

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function GET() {
  const accessToken =
    "ya29.a0AeDClZCJq23eJqBaS8w_UsykpJWYi3249tjvOGZ8xMUpqKGWTZ7nJ6Zw9ntem-YpDLAj2i6aviTjeK2bF4tRtWL6EWIjpot_3i660S6xYta_dzB8QOFKn0Fzqws3eS28gbZBRKzTShG_vVRZ46uCNY3kvVmq8gWstboTZy1haCgYKASoSARMSFQHGX2MieiAnmjr8LgBfXMOniCNggw0175";

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDummy),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
