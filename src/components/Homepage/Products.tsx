import React, { useEffect, useState } from 'react'
import { Product } from '../../helpers/useFetchProducts'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../state/cart/cartSlice';

const Products: React.FC = () => {
	const [visibleProductsCount, setVisibleProductsCount] = useState<number>(6);
	const [notification, setNotification] = useState<string | null>(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState<{[key: string]: boolean}>({});

	const filteredProducts = useSelector((state: RootState) => state.products.filteredProducts);
	const gridColumns = useSelector((state: RootState) => state.products.gridColumns);    

	const dispatch = useDispatch<AppDispatch>();


	const handleLoadMore = () => {
		setVisibleProductsCount((prev) => {
			const newCount = prev + 6;

			return newCount > filteredProducts.length ? filteredProducts.length : newCount;
		});	
	}
	
	const slicedProducts = filteredProducts.slice(0, visibleProductsCount);

	const handleAddToCart = (product: Product) => {
		dispatch(addToCart(product));

		setNotification(`${product.name} has been added to your cart.`)

		setIsButtonDisabled((prev) => ({...prev, [product.id]: true}));

		setTimeout(() => {
			setIsButtonDisabled((prev) => ({...prev, [product.id]: false}));
		}, 2000)
		
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
						return (
							<div className="section__product" key={product.id}>
								<div className="section__image">
									<img src={product.imageUrl} alt="" />
								</div>
								
								<div className="section__content">
									<div className="section__info">
										<span>{product.type}</span>
										
										<span className='section__product-name'>{product.name}</span>
										
										<span>{product.currency} {product.price.toFixed(2)}</span>
									</div>

									<button 
										onClick={() => handleAddToCart(product)}
										disabled={isButtonDisabled[product.id]}
										className={isButtonDisabled[product.id] ? 'button-disabled' : ''}
									>
										{ isButtonDisabled[product.id]  ? 'Adding...' :  'Add To Cart'}
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
