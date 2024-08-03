import React, { useState } from 'react';
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.avif';
import image3 from '../images/image3.jpg';
import Banner from '../components/Banner';
import Product from '../components/Product';
import productData from '../assets/raw_flipkart_data_with_images.json'; // Importing the JSON file directly

const Homepage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [bannerImages, setBannerImages] = useState([
    image1,
    image2,
    image3,
  ]);

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useState(() => {
    const shuffledProducts = shuffleArray(productData);
    const selectedProducts = shuffledProducts.slice(0, 20);
    setAllProducts(selectedProducts);
  }, []);

  

  return (
    <div>
      <Banner images={bannerImages} />
      <h2 className="font-bold text-3xl">Also look at:</h2>
      <div className="grid grid-cols-4 gap-4 p-4">
        {allProducts.map(product => (
          <Product
            key={product.pid}
            name={product.title}
            price={product.price}
            image={product.images.split('|')}
          />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
