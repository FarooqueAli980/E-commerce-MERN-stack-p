import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ====================== CREATE PAYMENT INTENT ======================
export const createPaymentIntent = async (req, res) => {
    try {
        const { items, shippingAddress, subtotal } = req.body;
        const userId = req.id;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        // Calculate tax (18%)
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const totalAmount = Math.round((subtotal + tax) * 100); // Stripe uses cents

        // Create line items for Stripe
        const lineItems = items.map((item) => {
            // Keep product data minimal to avoid URL length issues
            const productData = {
                name: (item.productName || item.name || "Product").substring(0, 100), // Limit name length
                // Note: Images and descriptions removed to avoid exceeding Stripe's 2048 character URL limit
            };
            
            return {
                price_data: {
                    currency: "inr",
                    product_data: productData,
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            };
        });

        // Build URLs - keep them as short as possible
        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").trim();
        const successUrl = `${frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${frontendUrl}/checkout`;

        console.log("🔗 Success URL length:", successUrl.length);
        console.log("🔗 Cancel URL length:", cancelUrl.length);

        // Validate URL lengths - must be under 2048 characters
        if (successUrl.length > 2000 || cancelUrl.length > 2000) {
            console.log("❌ URLs exceed safe limit");
            return res.status(400).json({
                success: false,
                message: "URL configuration too long. Frontend URL is too long."
            });
        }

        // Create Stripe session for embedded checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId.toString(),
                shippingAddress: JSON.stringify(shippingAddress),
            },
        });

        // Create order in database
        const order = await Order.create({
            userId,
            items,
            subtotal,
            tax,
            totalAmount: totalAmount / 100,
            shippingAddress,
            paymentMethod: "stripe",
            paymentStatus: "pending",
            stripeSessionId: session.id,
        });

        return res.status(200).json({
            success: true,
            clientSecret: session.client_secret,
            sessionId: session.id,
            orderId: order._id,
            amount: totalAmount / 100,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== CONFIRM PAYMENT ======================
export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;
        const userId = req.id;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
            // Update order status
            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    paymentStatus: "completed",
                    orderStatus: "confirmed",
                    stripePaymentId: paymentIntentId,
                },
                { new: true }
            );

            // Update product stock
            for (let item of order.items) {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
            }

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                order,
            });
        } else {
            // Update order status to failed
            await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus: "failed" },
                { new: true }
            );

            return res.status(400).json({
                success: false,
                message: "Payment failed",
                status: paymentIntent.status
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET ORDER ======================
export const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.id;

        const order = await Order.findById(orderId)
            .populate("userId", "firstName lastName email")
            .populate("items.productId", "name image price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET USER ORDERS ======================
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.id;

        const orders = await Order.find({ userId })
            .populate("items.productId", "name image price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== CREATE CHECKOUT SESSION ======================
export const createCheckoutSession = async (req, res) => {
    try {
        const { items, shippingAddress, subtotal } = req.body;
        const userId = req.id;

        console.log("🛒 Creating checkout session");
        console.log("   Items received:", items?.length || 0);
        console.log("   Subtotal:", subtotal);
        console.log("   User ID:", userId);

        if (!items || items.length === 0) {
            console.log("❌ Cart is empty");
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (!shippingAddress) {
            console.log("❌ No shipping address provided");
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        // Calculate tax
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const totalAmount = subtotal + tax;

        console.log("💰 Amount calculation:");
        console.log("   Subtotal:", subtotal);
        console.log("   Tax (18%):", tax);
        console.log("   Total:", totalAmount);

        // Create line items for Stripe
        const lineItems = items.map((item) => {
            // Keep product data minimal to avoid URL length issues
            const productData = {
                name: (item.productName || item.name || "Product").substring(0, 100), // Limit name length
                // Note: Images removed to avoid exceeding Stripe's 2048 character URL limit
            };
            
            return {
                price_data: {
                    currency: "inr",
                    product_data: productData,
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            };
        });

        console.log("✅ Line items created:", lineItems.length);

        // Build return URL - keep it as short as possible
        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").trim();
        
        // Simple return URL without extra parameters
        const returnUrl = `${frontendUrl}/return?session_id={CHECKOUT_SESSION_ID}`;

        console.log("🔗 Return URL length:", returnUrl.length, "characters");
        console.log("🔗 Return URL:", returnUrl);

        // Validate URL length - must be under 2048 characters
        if (returnUrl.length > 2000) {
            console.log("❌ URL exceeds safe limit:", returnUrl.length, "characters");
            return res.status(400).json({
                success: false,
                message: "URL configuration too long. Frontend URL is too long or too many items in cart."
            });
        }

        // Create checkout session with embedded UI mode
        console.log("🔄 Creating Stripe session...");
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: lineItems,
            mode: "payment",
            return_url: returnUrl,
            metadata: {
                userId: userId.toString(),
            },
        });

        console.log("✅ Stripe session created:", session.id);
        console.log("   Client Secret:", session.client_secret?.substring(0, 20) + "...");

        // Create order in database
        console.log("📝 Creating order in database...");
        const order = await Order.create({
            userId,
            items,
            subtotal,
            tax,
            totalAmount,
            shippingAddress,
            paymentMethod: "stripe",
            paymentStatus: "pending",
            stripeSessionId: session.id,
        });

        console.log("✅ Order created:", order._id);

        const responseData = {
            success: true,
            clientSecret: session.client_secret,
            sessionId: session.id,
            orderId: order._id,
        };

        console.log("📤 Sending response:", responseData);
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("❌ CRITICAL ERROR in createCheckoutSession:", error);
        console.error("   Error message:", error.message);
        console.error("   Error code:", error.code);
        
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};

// ====================== VERIFY SESSION ======================
export const verifySession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.id;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // Find and update order
            const order = await Order.findOneAndUpdate(
                { stripeSessionId: sessionId, userId },
                {
                    paymentStatus: "completed",
                    orderStatus: "confirmed",
                    stripePaymentId: session.payment_intent,
                },
                { new: true }
            );

            if (order) {
                // Update product stock
                for (let item of order.items) {
                    await Product.findByIdAndUpdate(
                        item.productId,
                        { $inc: { stock: -item.quantity } },
                        { new: true }
                    );
                }
            }

            return res.status(200).json({
                success: true,
                message: "Payment verified",
                order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ====================== GET SESSION STATUS ======================
export const getSessionStatus = async (req, res) => {
    try {
        console.log("🔍 GET /session-status called");
        console.log("   Query params:", req.query);
        
        const sessionId = req.query.session_id;

        if (!sessionId) {
            console.log("❌ No session_id provided");
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }

        console.log("🔍 Retrieving session from Stripe:", sessionId);
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        console.log("📊 Session details:", {
            payment_status: session.payment_status,
            payment_intent: session.payment_intent,
            customer_email: session.customer_details?.email,
            status: session.status
        });

        // If payment is successful, update the order status
        if (session.payment_status === "paid") {
            console.log("💰 Payment confirmed, looking for order with sessionId:", sessionId);
            
            const order = await Order.findOne({ stripeSessionId: sessionId });

            if (order) {
                console.log("📦 Found order:", order._id);
                
                if (order.paymentStatus !== "completed") {
                    console.log("⏳ Updating order payment status...");
                    
                    // Update order status
                    order.paymentStatus = "completed";
                    order.orderStatus = "confirmed";
                    order.stripePaymentId = session.payment_intent;
                    await order.save();

                    // Update product stock
                    for (let item of order.items) {
                        console.log(`📉 Reducing stock for product ${item.productId} by ${item.quantity}`);
                        await Product.findByIdAndUpdate(
                            item.productId,
                            { $inc: { stock: -item.quantity } },
                            { new: true }
                        );
                    }
                    
                    console.log("✅ Order updated successfully");
                } else {
                    console.log("ℹ️ Order already marked as completed");
                }
            } else {
                console.log("⚠️ Order not found for sessionId:", sessionId);
            }
        } else {
            console.log("❌ Payment not yet paid. Status:", session.payment_status);
        }

        const responseData = {
            status: session.payment_status,
            customer_email: session.customer_details?.email || '',
            success: session.payment_status === "paid"
        };
        
        console.log("✅ Sending response:", responseData);
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("❌ CRITICAL ERROR in getSessionStatus:", error);
        console.error("   Error message:", error.message);
        console.error("   Error stack:", error.stack);
        
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error.message
        });
    }
};
