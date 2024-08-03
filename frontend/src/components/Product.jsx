import React from 'react';
import Banner from './Banner';

const Product = ({ name, price, image }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Banner images={image} />
      {/* <img src={image} alt={name} className="w-full h-64 object-cover" /> */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        <h4 className="text-gray-600">Price: Rs.{price}</h4>
        {/* Add to cart button */}
      </div>
    </div>
  );
};

export default Product;
