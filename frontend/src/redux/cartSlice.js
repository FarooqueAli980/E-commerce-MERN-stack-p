import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
        totalItems: 0,
    },
    reducers: {
        // Add item to cart
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item._id === product._id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    ...product,
                    quantity: 1,
                });
            }
            
            // Recalculate totals
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        // Remove item from cart
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item._id !== productId);
            
            // Recalculate totals
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        // Update quantity
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item._id === productId);
            
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item._id !== productId);
                } else if (quantity > item.stock) {
                    item.quantity = item.stock;
                } else {
                    item.quantity = quantity;
                }
            }
            
            // Recalculate totals
            state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
            state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        // Clear cart
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalItems = 0;
        },

        // Load cart from localStorage
        loadCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalPrice = action.payload.totalPrice || 0;
            state.totalItems = action.payload.totalItems || 0;
        },
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
