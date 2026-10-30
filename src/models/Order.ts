import mongoose, { Schema, Document } from "mongoose";

export interface IOrderProduct {
  id: number;
  title: string;
  price: string;
  quantity: number;
  img: string;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: IOrderProduct[];
  subtotal: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    paymentMethod: { type: String, default: "cod" },
    items: [
      {
        id: Number,
        title: String,
        price: String,
        quantity: Number,
        img: String,
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "processing" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

