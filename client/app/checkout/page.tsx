"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore, useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import Header from "@/components/header";
import { cities } from "@/constant/city";
import { createOrder } from "@/lib/actions/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
    notes: "",
    tranxId: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      router.push("/login");
      return;
    }
    
    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      }));
    }
  }, [isAuthenticated, user, router]);

  const totalPrice = getTotalPrice();
  const shipping = formData.city === "dhaka" ? 100 : 120;
  const tax = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate transaction ID for COD
    if (formData.paymentMethod === "cod" && !formData.tranxId) {
      toast.error("Please enter the Transaction ID for delivery charge payment");
      return false;
    }

    // Validate transaction ID format (basic validation)
    if (formData.paymentMethod === "cod" && formData.tranxId.length < 6) {
      toast.error("Please enter a valid Transaction ID");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before processing
    if (!validateForm()) {
      return;
    }

    // Double-check authentication
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("🛒 Starting order submission...");
      console.log("📦 Cart items:", items);
      console.log("👤 User authenticated:", isAuthenticated);
      
      // Prepare order data for backend
      const orderData = {
        items: items.map((item: any) => ({
          product: item._id || item.id, // Use _id first, fallback to id
          quantity: item.quantity,
          price: parseFloat(item.price.replace("৳", "").replace(",", "")),
          size: item.selectedSize,
          color: item.selectedColor,
          name: item.name,
          image: item.image
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address,
          city: formData.city,
          zipCode: formData.postalCode,
          phone: formData.phone,
          email: formData.email
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        transactionId: formData.tranxId,
        totalAmount: finalTotal,
        shipping: shipping,
        tax: tax
      };

      console.log("📋 Order data prepared:", orderData);

      // Call backend API
      const result = await createOrder(orderData);
      
      console.log("📬 Backend response:", result);

      if (result.success) {
        // Show success toast
        toast.success(result.message || "Order placed successfully! You will receive a confirmation call shortly.");

        // Clear cart first, then navigate
        clearCart();
        
        // Navigate to order success page with order ID if available
        const orderSuccessUrl = result.order ? `/order-success?orderId=${result.order._id}` : "/order-success";
        router.push(orderSuccessUrl);
      } else {
        toast.error(result.message || "Failed to place order. Please try again.");
        setIsProcessing(false);
      }

    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Only redirect to cart if items are empty AND we're not processing an order
  if (items.length === 0 && !isProcessing) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1234 567890"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.toLowerCase()}
                              value={city.toLowerCase()}
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="1000"
                        value={formData.postalCode}
                        onChange={(e) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange("paymentMethod", value)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "cod" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="font-medium">
                          Delivery Charge:{" "}
                          <span className="text-green-600 font-semibold">
                            ৳{shipping}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-700">
                          Please send the delivery charge to the number below
                          and submit the Transaction ID.
                        </p>
                        <p className="font-semibold mt-1">
                          bKash / Nagad / Rocket Number:{" "}
                          <span className="text-blue-600">017XXXXXXXX</span>
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="tranxId">
                          Transaction ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="tranxId"
                          placeholder="e.g. TX123456789"
                          value={formData.tranxId}
                          onChange={(e) =>
                            handleInputChange("tranxId", e.target.value)
                          }
                          className="mt-1"
                          required
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Enter the transaction ID you received after sending the delivery charge
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special instructions for your order..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item: any) => (
                      <div
                        key={item.itemKey}
                        className="flex items-start space-x-3 py-2 border-b last:border-b-0"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight">
                            {item.name}
                          </h4>
                          <div className="flex flex-col gap-1 text-xs text-gray-600 mt-1">
                            {item.selectedColor && (
                              <span>
                                Color:{" "}
                                <span className="font-medium">
                                  {item.selectedColor}
                                </span>
                              </span>
                            )}
                            {item.selectedSize && (
                              <span>
                                Size:{" "}
                                <span className="font-medium">
                                  {item.selectedSize}
                                </span>
                              </span>
                            )}
                            <span>
                              Qty:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          ৳
                          {(
                            parseFloat(
                              item.price.replace("৳", "").replace(",", "")
                            ) * item.quantity
                          ).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Subtotal (
                        {items.reduce(
                          (total: number, item: any) => total + item.quantity,
                          0
                        )}{" "}
                        items)
                      </span>
                      <span>৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping ({formData.city === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                      <span>৳{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%)</span>
                      <span>৳{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>৳{finalTotal.toLocaleString()}</span>
                  </div>

                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <Input placeholder="Enter coupon code" />
                    <Button variant="outline" className="w-full" type="button">
                      Apply Coupon
                    </Button>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing Order..."
                      : `Place Order - ৳${finalTotal.toLocaleString()}`}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}