import React, { useEffect, useState } from 'react'
import { Product } from '../../helpers/useFetchProducts'
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const Products: React.FC = () => {
	const [visibleProductsCount, setVisibleProductsCount] = useState<number>(6);
	const [cartItems, setCartItems] = useState<Product[]>([]);
	const [notification, setNotification] = useState<string | null>(null);

	const filteredProducts = useSelector((state: RootState) => state.products.filteredProducts);
	const gridColumns = useSelector((state: RootState) => state.products.gridColumns);    

	useEffect(() => {
		const storedCartItems = sessionStorage.getItem('cartItems');

		if(storedCartItems) {
			setCartItems(JSON.parse(storedCartItems));
		}
	}, []);

	const handleLoadMore = () => {
		setVisibleProductsCount((prev) => {
			const newCount = prev + 6;

			return newCount > filteredProducts.length ? filteredProducts.length : newCount;
		});	
	}

	const slicedProducts = filteredProducts.slice(0, visibleProductsCount);

	const handleAddToCart = (product: Product) => {
		const productExists = cartItems.find((item: Product) => item.id === product.id);

		if(!productExists) {
			const updatedCart = [...cartItems, product];

			setCartItems(updatedCart);

			sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));

			setNotification(`${product.name} has been added to your cart.`)
		} else {
			const updatedCart = cartItems.filter((item: Product) => item.id !== product.id);

			setCartItems(updatedCart);
			sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));

			setNotification(`${product.name} has been removed from your cart.`)
		}

		setTimeout(() => {
			setNotification(null);
		}, 4000)
	}

  return (
    <div className='section__inner'>
		{
			notification && (
				<div className="notification">
					{notification}
				</div>
			)
		}

		<div className="section__products" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
			{
				slicedProducts.map((product) => {
					const inCart = cartItems.some((item) => item.id === product.id);

					return (
						<div className="section__product" key={product.id}>
							<div className="section__image">
								<img src={product.imageUrl} alt="" />
							</div>
							
							<div className="section__content">
								<div className="section__info">
									<span>{product.type}</span>
									
									<span className='section__product-name'>{product.name}</span>
									
									<span>{product.currency}{product.price}</span>
								</div>

								<button onClick={() => handleAddToCart(product)}>
									{inCart ? 'Remove From Cart' : 'Add To Cart'}
								</button>
							</div>
						</div>
					);
				})
			}      
		</div>

		<div className="section__actions">
			{ visibleProductsCount < filteredProducts.length && (
				<button onClick={handleLoadMore}>Load More</button>
			)}

			<span>Showing {slicedProducts.length} of {filteredProducts.length} Products</span>
		</div>
    </div>
  )
}

export default Products
