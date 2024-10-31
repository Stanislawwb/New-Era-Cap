import React, { useState } from 'react'
import { Product } from '../../helpers/useFetchProducts'

interface ProductsProps {
  products: Product[];
  gridColumns: number;
}

const Products: React.FC<ProductsProps> = ({products, gridColumns}) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(6);


  const handleLoadMore = () => {
	setVisibleProductsCount((prev) => {
		const newCount = prev + 6;

		return newCount > products.length ? products.length : newCount;
	});	
  }

  const slicedProducts = products.slice(0, visibleProductsCount);

  return (
    <div className='section__inner'>
		<div className="section__products" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
			{
				slicedProducts.map((product) => (
				<div className="section__product" key={product.id}>
					<div className="section__image">
						<img src={product.imageUrl} alt="" />
					</div>

					<span>{product.type}</span>
					
					<span className='section__product-name'>{product.name}</span>
					
					<span>{product.currency}{product.price}</span>
				</div>
				))
			}      
		</div>

		<div className="section__actions">
			{ visibleProductsCount < products.length && (
				<button onClick={handleLoadMore}>Load More</button>
			)}

			<span>Showing {slicedProducts.length} of {products.length} Products</span>
		</div>
    </div>
  )
}

export default Products
