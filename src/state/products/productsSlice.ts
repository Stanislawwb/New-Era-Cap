import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../helpers/useFetchProducts";

interface ProductsState {
    products: Product[],
    filteredProducts: Product[],
    loading: boolean,
    sortOption: string,
    isOpen: boolean,
    gridColumns: number,
    selectedTypes: string[],
    selectedColors: string[],
}

const initialState: ProductsState = {
    products: [],
    filteredProducts: [],
    loading: false,
    sortOption: 'title-ascending',
    isOpen: true,
    gridColumns: 3,
    selectedTypes: [],
    selectedColors: [],
}

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
            state.filteredProducts = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSortOption(state, action: PayloadAction<string>) {
            state.sortOption = action.payload;
            state.filteredProducts = [...state.products].sort((a, b) => {
                switch (state.sortOption) {
                    case 'title-ascending':
                        return a.name.localeCompare(b.name);
                    case 'title-descending':
                        return b.name.localeCompare(a.name);
                    case 'price-ascending':
                        return a.price - b.price;
                    case 'price-descending':
                        return b.price - a.price;
                    default:
                        return 0;
                }
            });
        },
        toggleSidebar(state) {
            state.isOpen = !state.isOpen;
        },
        changeGridColumns(state) {
            const maxColumns = 6;
            const minColumns = 3;

            if ( state.gridColumns >= maxColumns || state.filteredProducts.length <= state.gridColumns ) {
                state.gridColumns = minColumns;
            } else {
                state.gridColumns = state.gridColumns + 1;
            }
        },
        
        toggleType(state, action: PayloadAction<string>) {
            const type = action.payload;

            if(state.selectedTypes.includes(type)) {
                state.selectedTypes = state.selectedTypes.filter((t) => t !== type)
            } else {
                state.selectedTypes.push(type);
            }

            state.filteredProducts = state.products.filter((product) =>
                (state.selectedColors.length === 0 || state.selectedColors.includes(product.color)) &&
                (state.selectedTypes.length === 0 || state.selectedTypes.includes(product.type))
            )
        },
        toggleColor(state, action: PayloadAction<string>) {
            const color = action.payload;

            if(state.selectedColors.includes(color)) {
                state.selectedColors = state.selectedColors.filter((c) => c !== color);
            } else {
                state.selectedColors.push(color);
            };

            state.filteredProducts = state.products.filter((product) => 
                (state.selectedTypes.length === 0 || state.selectedTypes.includes(product.type)) &&            
                (state.selectedColors.length === 0 || state.selectedColors.includes(product.color))
            )
        },
        clearFilters(state) {
            state.selectedColors = [];
            state.selectedTypes = [];
            state.filteredProducts = state.products;
        }
    }
});

export const { setProducts, setLoading, setSortOption, toggleColor, changeGridColumns, toggleType, clearFilters, toggleSidebar } = productsSlice.actions;

export default productsSlice.reducer;