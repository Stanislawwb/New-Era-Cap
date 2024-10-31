import React from 'react'

interface ProductsHeaderProps {
    count: number;
    onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onFilterClick: () => void;
    onChangeView: () => void;
    gridColumns: number;
    onClearFilters: () => void;
    selectedTypeCount: number;
    selectedColorCount: number;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ count, onSortChange, onFilterClick, onChangeView, gridColumns, onClearFilters, selectedTypeCount, selectedColorCount }) => {
    const totalSelectedFilters = selectedColorCount + selectedTypeCount;

  return (
    <div className="section__header">
        <h1>Headwear</h1>

        <p>We're the original headwear brand. Presenting our iconic collection of New Era caps, beanies and bucket hats. We have a cap for every style, including 59FIFTY fitted caps, 9FIFTY snapbacks, 9FORTY adjustable caps, 39THIRTY stretch-fit, and the 9TWENTY cap. You can shop by colour, team, sport or collection with our exclusive range of headwear styles.</p>

        <div className="section__bar">
            <div className='section__bar-button'>
                <button onClick={onFilterClick}>
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="2.5" x2="24" y2="2.5" stroke="currentColor"></line>
                        <rect x="4.5" y="0.5" width="3" height="4" stroke="currentColor" className="rect-top"></rect>
                        <line y1="7.5" x2="24" y2="7.5" stroke="currentColor"></line>
                        <rect x="11.5" y="5.5" width="3" height="4" stroke="currentColor" className="rect-bottom"></rect>
                    </svg>

                    Filters 

                    <span>{totalSelectedFilters}</span>
                </button>

                { totalSelectedFilters > 0 && (
                    <button className='clear-btn' onClick={() => onClearFilters()}>Clear All</button>
                    )                
                }
            </div>

            <div className='section__bar-info'>
                <span>{count} products</span>
                
                <button onClick={onChangeView}>
                    {
                        [...Array(6)].map((_, index) => (
                            <span 
                                key={index}
                                style={{
                                    display: 'inline-block',
                                    width: '4px',
                                    height: '11px',
                                    border: '1px solid black',
                                    backgroundColor: index < gridColumns ? 'black' : 'transparent',
                                    margin: '0 1px',
                                }}
                            >
                            </span>
                        ))
                    }
                </button>
            </div>

            <div className='section__bar-sort'>
                <select name="sort_by" id="sort_by" onChange={onSortChange}>
                    <option value="title-ascending">Alphabetically, A-Z</option>

                    <option value="title-descending">Alphabetically, Z-A</option>

                    <option value="price-ascending">Price, low to high</option>

                    <option value="price-descending">Price, high to low</option>
                </select>
            </div>
        </div>
    </div>
  )
}

export default ProductsHeader