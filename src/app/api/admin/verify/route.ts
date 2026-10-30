import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const correctPin = process.env.ADMIN_PIN || "admin123";

    if (pin === correctPin) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Incorrect Admin Security PIN" }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
