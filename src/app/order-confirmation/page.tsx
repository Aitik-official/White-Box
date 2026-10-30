import React, { Suspense } from "react";
import OrderConfirmationClient from "@/app/order-confirmation/OrderConfirmationClient";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading Order Summary...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
