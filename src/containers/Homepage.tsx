import { useEffect } from "react";
import Filters from "../components/Homepage/Filters";
import Products from "../components/Homepage/Products";
import ProductsHeader from "../components/Homepage/ProductsHeader";
import useFetchProducts from "../helpers/useFetchProducts";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../state/store";
import { setProducts } from "../state/products/productsSlice";
import { useSelector } from "react-redux";
import { setSortOption } from "../state/products/productsSlice";
import { toggleSidebar } from "../state/products/productsSlice";

const Homepage = () => {
    const {products, loading} = useFetchProducts();

    const filteredProducts = useSelector((state: RootState) => state.products.filteredProducts);
    const isOpen = useSelector((state: RootState) => state.products.isOpen);
    const initialValueForSortOption  = useSelector((state: RootState) => state.products.sortOption);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() =>{
        if (products) {
            dispatch(setProducts(products))

            dispatch(setSortOption(initialValueForSortOption));
        }
    }, [products, initialValueForSortOption, dispatch]);
    
    return (
        <div className="section-products">
            <ProductsHeader/>

            <div className="section__content">
                <div className={`section__sidebar ${isOpen ? 'active' : 'hidden'}`}>
                    <div className="section__sidebar-head">
                        <h4>Filter</h4> 

                        <Filters />
                    </div>

                    <button onClick={() => dispatch(toggleSidebar())} className="show-results">Show Results</button>
                </div>

                { loading ? (
                    <p>Loading products...</p>
                ) : filteredProducts.length > 0 ? (
                    <Products />
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    )
}

export default Homepage
