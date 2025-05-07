// src/Components/images/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import img1 from '../../Pictures/Carousel/img59586.jpg';
import img2 from '../../Pictures/Carousel/img71604.jpg';
import img3 from '../../Pictures/Carousel/img76774.jpg';
import img4 from '../../Pictures/Carousel/img77475.jpg';

const ImageCarousel = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // טוען את התמונות רק לאחר שהרכיב עלה
    setImages([img1, img2, img3, img4]);
  }, []); // רץ רק פעם אחת

  const imageTemplate = (image) => (
    <div className="carousel-item" style={{ padding: '0 1rem' }}>
      <img
        src={image}
        alt="carousel-item"
        style={{
          width: '100%',
          height: '400px',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />
    </div>
  );

  if (images.length === 0) return null; // בזמן טעינה, אל תציג כלום

  return (
    <div className="card" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <Carousel
        value={images}
        itemTemplate={imageTemplate}
        numVisible={1}
        numScroll={1}
        circular
        autoplayInterval={3000}
        showIndicators
        showNavigators
      />
    </div>
  );
};

export default ImageCarousel;
