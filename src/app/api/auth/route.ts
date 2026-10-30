import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, name, isLogin } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (isLogin) {
      if (!user) {
        return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
      }

      if (user.password && password) {
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // Registration flow
    if (user) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    user = new User({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: password || undefined,
    });
    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    console.error("Auth API Error:", err);
    return NextResponse.json(
      { error: "Internal server error connecting to database" },
      { status: 500 }
    );
  }
}
