import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products/productsSlice";
import cartReducer from "./cart/cartSlice";

export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
    }
});

let previousCartState = store.getState().cart.cartItems;

store.subscribe(() => {
    const currentCartState = store.getState().cart.cartItems;

    if ( previousCartState !== currentCartState ) {
        localStorage.setItem('cartItems', JSON.stringify(currentCartState));

        previousCartState = currentCartState;
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;