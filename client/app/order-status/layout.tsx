import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Status | Ex-Commerce",
  description: "View your order status and tracking information",
};

export default function OrderStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
