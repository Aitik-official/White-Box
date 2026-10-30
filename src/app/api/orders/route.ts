import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (err: unknown) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      postalCode,
      paymentMethod,
      items,
      subtotal,
      total,
    } = body;

    if (!customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    await connectDB();

    const orderId = `WB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      postalCode,
      paymentMethod: paymentMethod || "cod",
      items,
      subtotal: subtotal || 0,
      total: total || subtotal || 0,
      status: "processing",
    });

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        id: order._id,
        total: order.total,
        status: order.status,
      },
    });
  } catch (err: unknown) {
    console.error("Order API Error:", err);
    return NextResponse.json(
      { error: "Failed to persist order in database" },
      { status: 500 }
    );
  }
}

// Admin: Update order status
export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    await connectDB();

    const order = await Order.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
