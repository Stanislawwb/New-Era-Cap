import React, { useState } from 'react'
import { Product } from '../../helpers/useFetchProducts';

interface FiltersProps {
  products: Product[]
  selectedTypes: string[];
  selectedColors: string[];
  onTypeChange: (type: string) => void;
  onColorChange: (color: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ products, onTypeChange, onColorChange, selectedTypes, selectedColors }) => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  const uniqueType = [...new Set(products.map((product) => product.type))];
  const uniqueColors = [...new Set(products.map((product) => product.color))];

  return (
    <div className='filters'>
      <div className="filter">
        <h3 onClick={() => setIsTypeOpen(!isTypeOpen)} className={ isTypeOpen ? 'open' : ''}>
          Type

          <span></span>
        </h3>

        <div className={`filter__options ${isTypeOpen ? 'open' : ''}`}>
          {
            uniqueType.map((type) => {
              const typeCount = products.filter((product) => product.type === type).length;

              return (
              <div className="filter__option" key={type}>
                <input 
                  type="checkbox" 
                  id={`checkbox-${type.toLowerCase().replace(/\s+/g, '')}`}  
                  value={type}
                  checked={selectedTypes.includes(type)}
                  onChange={() => onTypeChange(type)}
                />

                <label htmlFor={`checkbox-${type.toLowerCase().replace(/\s+/g, '')}`}>  
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
            uniqueColors.map((color) => {
              const colorCount = products.filter((product) => product.color === color).length;

              return (
                <div className="filter__option" key={color}>
                  <input 
                    type="checkbox" 
                    id={`checkbox-${color.toLowerCase().replace(/\s+/g, '')}`}  
                    value={color}
                    checked={selectedColors.includes(color)}
                    onChange={() => onColorChange(color)}
                  />
  
                  <label htmlFor={`checkbox-${color.toLowerCase().replace(/\s+/g, '')}`}>  
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
