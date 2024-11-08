import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../state/store';
import { toggleColor, toggleType } from '../../state/products/productsSlice';
import { useDispatch } from 'react-redux';

const Filters: React.FC = () => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const products = useSelector((state: RootState) => state.products.products);
  const selectedTypes = useSelector((state: RootState) => state.products.selectedTypes);
  const selectedColors = useSelector((state: RootState) => state.products.selectedColors);

  const dispatch = useDispatch<AppDispatch>();

  const filteredTypes = selectedColors.length > 0
    ? [...new Set(products
        .filter((product) => selectedColors.includes(product.color))
        .map((product) => product.type)
      )]
    : [...new Set(products.map((product) => product.type))];

  const filteredColors = selectedTypes.length > 0
    ? [...new Set(products
        .filter((product) => selectedTypes.includes(product.type))
        .map((product) => product.color)
      )]
    : [...new Set(products.map((product) => product.color))];

  return (
    <div className='filters'>
      <div className="filter">
        <h3 onClick={() => setIsTypeOpen(!isTypeOpen)} className={ isTypeOpen ? 'open' : ''}>
          Type

          <span></span>
        </h3>

        <div className={`filter__options ${isTypeOpen ? 'open' : ''}`}>
          {
            filteredTypes.map((type) => {
              const typeCount = products.filter((product) => product.type === type).length;
              const typeLowerCase = type.toLowerCase().replace(/\s+/g, '-')
              return (
              <div className="filter__option" key={type}>
                <input 
                  type="checkbox" 
                  id={`checkbox-${typeLowerCase}`}  
                  value={typeLowerCase}
                  checked={selectedTypes.includes(type)}
                  onChange={() => dispatch(toggleType(type))}
                />

                <label htmlFor={`checkbox-${typeLowerCase}`}>  
                  {type} <span>{typeCount}</span>
                </label>                   
              </div>
              );
            })}
        </div>
      </div>

      <div className="filter">
        <h3 onClick={() => setIsColorOpen(!isColorOpen)} className={ isColorOpen ? 'open' : ''}>
          Color 
          
          <span></span>
        </h3>

        <div className={`filter__options ${isColorOpen ? 'open' : ''}`}>
          {
            filteredColors.map((color) => {
              const colorCount = products.filter((product) => product.color === color).length;
              const colorLowerCase = color.toLowerCase().replace(/\s+/g, '-')

              return (
                <div className="filter__option" key={color}>
                  <input 
                    type="checkbox" 
                    id={`checkbox-${colorLowerCase}`}  
                    value={colorLowerCase}
                    checked={selectedColors.includes(color)}
                    onChange={() => dispatch(toggleColor(color))}
                  />
  
                  <label htmlFor={`checkbox-${colorLowerCase}`}>  
                    {color} <span>{colorCount}</span>
                  </label>                    
                </div>
            )})           
          }
        </div>
      </div>
    </div>
  )
}

export default Filters
