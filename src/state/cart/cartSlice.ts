import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../helpers/useFetchProducts";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
}

const loadCartFromLocalStorage  = (): CartItem[] => {
    const storedCart = localStorage.getItem('cartItems');

    return storedCart ? JSON.parse(storedCart) : [];
}

const initialState: CartState  = {
    cartItems: loadCartFromLocalStorage (),
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const productExists = state.cartItems.find(
                (item) => item.product.id === action.payload.id
            )

            if(productExists) {
                productExists.quantity += 1;
            } else {
                state.cartItems.push({product: action.payload, quantity: 1});
            }
        },
        decreaseQuantity: (state, action: PayloadAction<Product>) => {
            const product = state.cartItems.find(
                (item) => item.product.id === action.payload.id
            );

            if(product && product.quantity > 1 ) {
                product.quantity -= 1;
            }
        },
        increaseQuantity: (state, action: PayloadAction<Product>) => {
            const product = state.cartItems.find(
                (item) => item.product.id === action.payload.id
            )

            if (product) {
                product.quantity += 1;
            }
        },
        removeFromCart: (state, action: PayloadAction<Product>) => {
            state.cartItems.filter(
                (item) => item.product.id !== action.payload.id
            )
        },
        clearCart: (state) => {
            state.cartItems = [];

            localStorage.removeItem('cartItems');
        }
    }
});

export const { addToCart, decreaseQuantity, increaseQuantity, removeFromCart, clearCart} = cartSlice.actions;

export default cartSlice.reducer;