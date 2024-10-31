import { useState } from "react";
import Filters from "../components/Homepage/Filters";
import Products from "../components/Homepage/Products";
import ProductsHeader from "../components/Homepage/ProductsHeader";
import useFetchProducts from "../helpers/useFetchProducts";

const Homepage = () => {
    const {products, loading} = useFetchProducts();
    const [sortOption, setSortOption] = useState<string>("title-ascending");
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [gridColumns, setGridColumns] = useState<number>(3);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const handleTypeChange = (type: string) => {
        setSelectedTypes((prev) => 
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev,type]
        )
    }

    const handleColorChange = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        )
    }

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    }

    const handleIsOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleChangeView = () => {
        setGridColumns((prev) => {
            if (prev === 3 ) return 4;
            if (prev === 4 ) return 5;
            if (prev === 5 ) return 6;
            return 3
        })
    }

    const filteredProducts = products.filter((product) => {
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
        const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
        return matchesType && matchesColor;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case "title-ascending":
                return a.name.localeCompare(b.name);
            case "title-descending":
                return b.name.localeCompare(a.name);
            case "price-ascending":
                return a.price - b.price;
            case "price-descending":
                return b.price - a.price;
            default:
                return 0;
        }
    });

    const clearFilters = () => {
        setSelectedTypes([]);
        setSelectedColors([]);
    }

    const selectedTypeCount = selectedTypes.length;
    const selectedColorCount = selectedColors.length;

    return (
        <div className="section-products">
            <ProductsHeader 
                count={sortedProducts.length} 
                onSortChange={handleSortChange} 
                onFilterClick={handleIsOpen} 
                onChangeView={handleChangeView} 
                gridColumns={gridColumns} 
                onClearFilters={clearFilters}
                selectedTypeCount={selectedTypeCount}
                selectedColorCount={selectedColorCount}
            />

            <div className="section__content">
                <div className={`section__sidebar ${isOpen ? '' : 'hidden'}`}>
                    <Filters 
                        products={products} 
                        onTypeChange={handleTypeChange} 
                        onColorChange={handleColorChange}
                        selectedTypes={selectedTypes} 
                        selectedColors={selectedColors}
                    />
                </div>  

                { loading ? (
                    <p>Loading products...</p>
                ) : sortedProducts.length > 0 ? (
                    <Products 
                        products={sortedProducts} 
                        gridColumns={gridColumns} 
                    />
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    )
}

export default Homepage
