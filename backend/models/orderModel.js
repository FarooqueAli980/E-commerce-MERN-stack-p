import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            productName: String,
            price: Number,
            quantity: Number,
            image: String,
        }
    ],
    totalAmount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    shippingAddress: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    paymentMethod: { type: String, enum: ["stripe", "cod"], default: "cod" },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    stripePaymentId: String,
    stripeSessionId: String,
    notes: String,
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
